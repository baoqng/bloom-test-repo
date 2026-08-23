// bloom-deps:

export function parseIpAddress(input: unknown): {
  version: 4 | 6;
  address: string;
  normalized: string;
  classification: 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' | 'reserved';
} {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const trimmed = input.trim();

  // Try IPv4 first
  const ipv4Result = tryParseIPv4(trimmed);
  if (ipv4Result !== null) {
    return {
      version: 4,
      address: trimmed,
      normalized: ipv4Result.normalized,
      classification: classifyIPv4(ipv4Result.octets),
    };
  }

  // Try IPv6
  const ipv6Result = tryParseIPv6(trimmed);
  if (ipv6Result !== null) {
    return {
      version: 6,
      address: trimmed,
      normalized: ipv6Result.normalized,
      classification: classifyIPv6(ipv6Result.groups),
    };
  }

  throw new SyntaxError('Invalid IP address');
}

interface IPv4Parsed {
  octets: number[];
  normalized: string;
}

function tryParseIPv4(input: string): IPv4Parsed | null {
  const parts = input.split('.');
  if (parts.length !== 4) return null;

  const octets: number[] = [];
  for (const part of parts) {
    // Must be a non-empty string of digits only
    if (!/^\d+$/.test(part)) return null;
    const val = parseInt(part, 10);
    if (val < 0 || val > 255) return null;
    octets.push(val);
  }

  const normalized = octets.join('.');
  return { octets, normalized };
}

function classifyIPv4(octets: number[]): 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' | 'reserved' {
  const [a, b] = octets;

  // loopback: 127.x.x.x
  if (a === 127) return 'loopback';

  // private: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
  if (a === 10) return 'private';
  if (a === 172 && b >= 16 && b <= 31) return 'private';
  if (a === 192 && b === 168) return 'private';

  // link-local: 169.254.x.x
  if (a === 169 && b === 254) return 'link-local';

  // multicast: 224-239.x.x.x
  if (a >= 224 && a <= 239) return 'multicast';

  // reserved: 0.x.x.x and 240-255.x.x.x
  if (a === 0) return 'reserved';
  if (a >= 240 && a <= 255) return 'reserved';

  return 'public';
}

interface IPv6Parsed {
  groups: number[];
  normalized: string;
}

function tryParseIPv6(input: string): IPv6Parsed | null {
  // Check for multiple '::' occurrences
  const doubleColonCount = (input.match(/::/g) || []).length;
  if (doubleColonCount > 1) return null;

  let groups: number[];

  if (input.includes('::')) {
    // Compressed form
    const [left, right] = input.split('::');
    const leftGroups = left ? left.split(':') : [];
    const rightGroups = right ? right.split(':') : [];

    // Validate each group
    for (const g of [...leftGroups, ...rightGroups]) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    }

    const totalExplicit = leftGroups.length + rightGroups.length;
    if (totalExplicit > 7) return null;

    const fillCount = 8 - totalExplicit;
    const fillGroups = Array(fillCount).fill(0);

    const leftValues = leftGroups.map(g => parseInt(g, 16));
    const rightValues = rightGroups.map(g => parseInt(g, 16));

    groups = [...leftValues, ...fillGroups, ...rightValues];
  } else {
    // Full form: exactly 8 groups
    const parts = input.split(':');
    if (parts.length !== 8) return null;

    groups = [];
    for (const part of parts) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(part)) return null;
      groups.push(parseInt(part, 16));
    }
  }

  if (groups.length !== 8) return null;

  // Normalize: lowercase, remove leading zeros, minimal non-empty hex string
  const normalized = groups.map(g => g.toString(16)).join(':');

  return { groups, normalized };
}

function classifyIPv6(groups: number[]): 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' | 'reserved' {
  // loopback: ::1 => all zeros except last group = 1
  if (groups[0] === 0 && groups[1] === 0 && groups[2] === 0 && groups[3] === 0 &&
      groups[4] === 0 && groups[5] === 0 && groups[6] === 0 && groups[7] === 1) {
    return 'loopback';
  }

  const firstGroup = groups[0];

  // multicast: ff00::/8 => first 8 bits = 11111111 => first group high byte = 0xff
  // First group is 16 bits; first 8 bits = 0xff means firstGroup >= 0xff00 && firstGroup <= 0xffff
  if ((firstGroup & 0xff00) === 0xff00) return 'multicast';

  // link-local: fe80::/10 => first 10 bits = 1111111010
  // First group: 1111111010xxxxxx => 0xfe80 to 0xfebf
  if (firstGroup >= 0xfe80 && firstGroup <= 0xfebf) return 'link-local';

  // private: fc00::/7 => first 7 bits = 1111110 => firstGroup in 0xfc00-0xfdff
  if (firstGroup >= 0xfc00 && firstGroup <= 0xfdff) return 'private';

  return 'public';
}