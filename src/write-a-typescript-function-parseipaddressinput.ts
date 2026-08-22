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
    if (part === '') return null;
    // Must be purely decimal digits
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

  if (doubleColonCount === 1) {
    // Compressed form
    const [left, right] = input.split('::');
    const leftGroups = left === '' ? [] : left.split(':');
    const rightGroups = right === '' ? [] : right.split(':');

    // Validate left and right groups
    for (const g of [...leftGroups, ...rightGroups]) {
      if (!isValidHexGroup(g)) return null;
    }

    const totalExplicit = leftGroups.length + rightGroups.length;
    if (totalExplicit > 7) return null; // :: must expand to at least one group

    const missingCount = 8 - totalExplicit;
    const expandedMiddle = Array(missingCount).fill('0');

    const allGroups = [...leftGroups, ...expandedMiddle, ...rightGroups];
    groups = allGroups.map(g => parseInt(g, 16));
  } else {
    // Full form: must have exactly 8 groups
    const parts = input.split(':');
    if (parts.length !== 8) return null;

    for (const g of parts) {
      if (!isValidHexGroup(g)) return null;
    }

    groups = parts.map(g => parseInt(g, 16));
  }

  if (groups.length !== 8) return null;

  // Normalize: lowercase hex, remove leading zeros, keep at least one digit
  const normalized = groups
    .map(g => g.toString(16))
    .join(':');

  return { groups, normalized };
}

function isValidHexGroup(g: string): boolean {
  if (g === '') return false;
  if (g.length > 4) return false;
  return /^[0-9a-fA-F]+$/.test(g);
}

function classifyIPv6(groups: number[]): 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' | 'reserved' {
  const first = groups[0];

  // loopback: ::1 => all groups 0 except last is 1
  if (groups[0] === 0 && groups[1] === 0 && groups[2] === 0 && groups[3] === 0 &&
      groups[4] === 0 && groups[5] === 0 && groups[6] === 0 && groups[7] === 1) {
    return 'loopback';
  }

  // multicast: ff00::/8 => first byte is 0xff (first group has high byte 0xff => first >= 0xff00)
  if ((first & 0xff00) === 0xff00) return 'multicast';

  // link-local: fe80::/10 => first 10 bits = 1111111010
  // fe80 = 1111111010000000, febf = 1111111010111111
  // first group & 0xffc0 === 0xfe80
  if ((first & 0xffc0) === 0xfe80) return 'link-local';

  // private: fc00::/7 => first 7 bits = 1111110
  // fc00 = 1111110000000000, fdff = 1111110111111111
  // first group & 0xfe00 === 0xfc00
  if ((first & 0xfe00) === 0xfc00) return 'private';

  return 'public';
}