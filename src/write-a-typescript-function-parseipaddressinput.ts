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

function tryParseIPv4(input: string): { octets: number[]; normalized: string } | null {
  const parts = input.split('.');
  if (parts.length !== 4) return null;

  const octets: number[] = [];
  for (const part of parts) {
    if (part === '') return null;
    // Must be only decimal digits
    if (!/^\d+$/.test(part)) return null;
    const value = parseInt(part, 10);
    if (value < 0 || value > 255) return null;
    octets.push(value);
  }

  const normalized = octets.join('.');
  return { octets, normalized };
}

function classifyIPv4(octets: number[]): 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' | 'reserved' {
  const [a, b] = octets;

  // Loopback: 127.x.x.x
  if (a === 127) return 'loopback';

  // Private: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
  if (a === 10) return 'private';
  if (a === 172 && b >= 16 && b <= 31) return 'private';
  if (a === 192 && b === 168) return 'private';

  // Link-local: 169.254.x.x
  if (a === 169 && b === 254) return 'link-local';

  // Multicast: 224-239.x.x.x
  if (a >= 224 && a <= 239) return 'multicast';

  // Reserved: 0.x.x.x and 240-255.x.x.x
  if (a === 0) return 'reserved';
  if (a >= 240 && a <= 255) return 'reserved';

  return 'public';
}

function tryParseIPv6(input: string): { groups: number[]; normalized: string } | null {
  // Count occurrences of '::'
  const doubleColonCount = (input.match(/::/g) || []).length;
  if (doubleColonCount > 1) return null;

  let groups: number[];

  if (doubleColonCount === 1) {
    // Compressed form
    const [left, right] = input.split('::');
    const leftGroups = left === '' ? [] : parseIPv6Groups(left);
    const rightGroups = right === '' ? [] : parseIPv6Groups(right);

    if (leftGroups === null || rightGroups === null) return null;

    const fillCount = 8 - leftGroups.length - rightGroups.length;
    if (fillCount < 0) return null;

    groups = [...leftGroups, ...Array(fillCount).fill(0), ...rightGroups];
  } else {
    // Full form
    const parsed = parseIPv6Groups(input);
    if (parsed === null) return null;
    if (parsed.length !== 8) return null;
    groups = parsed;
  }

  if (groups.length !== 8) return null;

  const normalized = groups.map(g => g.toString(16)).join(':');
  return { groups, normalized };
}

function parseIPv6Groups(segment: string): number[] | null {
  if (segment === '') return null;
  const parts = segment.split(':');
  const groups: number[] = [];
  for (const part of parts) {
    if (part === '') return null;
    if (!/^[0-9a-fA-F]{1,4}$/.test(part)) return null;
    groups.push(parseInt(part, 16));
  }
  return groups;
}

function classifyIPv6(groups: number[]): 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' | 'reserved' {
  const first = groups[0];

  // Loopback: ::1 — all groups zero except last = 1
  if (groups.slice(0, 7).every(g => g === 0) && groups[7] === 1) return 'loopback';

  // Multicast: ff00::/8 — first 8 bits = 11111111, i.e. first group high byte = 0xff
  const firstHighByte = (first >> 8) & 0xff;
  if (firstHighByte === 0xff) return 'multicast';

  // Private: fc00::/7 — first 7 bits = 1111110, covers fc00-fdff
  // First group & 0xfe00 === 0xfc00
  if ((first & 0xfe00) === 0xfc00) return 'private';

  // Link-local: fe80::/10 — first 10 bits = 1111111010, covers fe80-febf
  // First group & 0xffc0 === 0xfe80
  if ((first & 0xffc0) === 0xfe80) return 'link-local';

  return 'public';
}