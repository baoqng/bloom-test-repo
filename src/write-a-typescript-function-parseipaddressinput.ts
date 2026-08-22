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
    if (!/^\d+$/.test(part)) return null;
    const num = Number(part);
    if (!Number.isInteger(num) || num < 0 || num > 255) return null;
    octets.push(num);
  }

  const normalized = octets.join('.');
  return { octets, normalized };
}

function classifyIPv4(octets: number[]): 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' | 'reserved' {
  const [a, b] = octets;

  if (a === 127) return 'loopback';
  if (a === 10) return 'private';
  if (a === 172 && b >= 16 && b <= 31) return 'private';
  if (a === 192 && b === 168) return 'private';
  if (a === 169 && b === 254) return 'link-local';
  if (a >= 224 && a <= 239) return 'multicast';
  if (a === 0) return 'reserved';
  if (a >= 240 && a <= 255) return 'reserved';
  return 'public';
}

function tryParseIPv6(input: string): { groups: number[]; normalized: string } | null {
  // Check for multiple '::' occurrences
  const doubleColonCount = (input.match(/::/g) || []).length;
  if (doubleColonCount > 1) return null;

  let groupStrings: string[];

  if (doubleColonCount === 1) {
    // Compressed form
    const [left, right] = input.split('::');
    const leftGroups = left === '' ? [] : left.split(':');
    const rightGroups = right === '' ? [] : right.split(':');

    // Validate left and right groups
    for (const g of [...leftGroups, ...rightGroups]) {
      if (g === '') return null;
      if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    }

    const filledCount = 8 - leftGroups.length - rightGroups.length;
    if (filledCount < 0) return null;

    const filledGroups = Array(filledCount).fill('0');
    groupStrings = [...leftGroups, ...filledGroups, ...rightGroups];
  } else {
    // Full form
    groupStrings = input.split(':');
    if (groupStrings.length !== 8) return null;

    for (const g of groupStrings) {
      if (g === '') return null;
      if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    }
  }

  if (groupStrings.length !== 8) return null;

  // Parse groups as numbers
  const groups: number[] = groupStrings.map(g => parseInt(g, 16));

  // Normalize: lowercase, remove leading zeros (keep at least one digit)
  const normalized = groups.map(g => g.toString(16)).join(':');

  return { groups, normalized };
}

function classifyIPv6(groups: number[]): 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' | 'reserved' {
  // ::1 loopback: all groups 0 except last which is 1
  const isLoopback = groups.every((g, i) => i === 7 ? g === 1 : g === 0);
  if (isLoopback) return 'loopback';

  const firstGroup = groups[0];

  // ff00::/8 — first 8 bits are 11111111 (0xff)
  // First group >= 0xff00 and <= 0xffff
  if ((firstGroup & 0xff00) === 0xff00) return 'multicast';

  // fe80::/10 — first 10 bits = 1111111010
  // First group: 0xfe80 to 0xfebf (mask 0xffc0)
  if ((firstGroup & 0xffc0) === 0xfe80) return 'link-local';

  // fc00::/7 — first 7 bits = 1111110
  // First group: 0xfc00 to 0xfdff (mask 0xfe00)
  if ((firstGroup & 0xfe00) === 0xfc00) return 'private';

  return 'public';
}