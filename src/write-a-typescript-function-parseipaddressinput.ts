// bloom-deps:

type Classification = 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' | 'reserved';

interface ParsedIpAddress {
  version: 4 | 6;
  address: string;
  normalized: string;
  classification: Classification;
}

function parseIPv4(input: string): { octets: number[] } | null {
  const parts = input.split('.');
  if (parts.length !== 4) return null;
  const octets: number[] = [];
  for (const part of parts) {
    if (part === '' || !/^\d+$/.test(part)) return null;
    const val = parseInt(part, 10);
    if (!isFinite(val) || val < 0 || val > 255) return null;
    octets.push(val);
  }
  return { octets };
}

function normalizeIPv4(octets: number[]): string {
  return octets.join('.');
}

function classifyIPv4(octets: number[]): Classification {
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

function parseIPv6(input: string): { groups: string[] } | null {
  // Check for more than one '::'
  const doubleColonCount = (input.match(/::/g) || []).length;
  if (doubleColonCount > 1) return null;

  let groups: string[];

  if (doubleColonCount === 1) {
    // Compressed form
    const [left, right] = input.split('::');
    const leftGroups = left === '' ? [] : left.split(':');
    const rightGroups = right === '' ? [] : right.split(':');

    // Validate each group
    for (const g of [...leftGroups, ...rightGroups]) {
      if (g === '' || !/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    }

    const missingCount = 8 - leftGroups.length - rightGroups.length;
    if (missingCount < 0) return null;

    const filledGroups = Array(missingCount).fill('0');
    groups = [...leftGroups, ...filledGroups, ...rightGroups];
  } else {
    // Full form
    groups = input.split(':');
    if (groups.length !== 8) return null;
    for (const g of groups) {
      if (g === '' || !/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    }
  }

  if (groups.length !== 8) return null;

  return { groups };
}

function normalizeIPv6(groups: string[]): string {
  return groups.map(g => {
    // Remove leading zeros, keep at least one digit
    const lower = g.toLowerCase();
    const stripped = lower.replace(/^0+/, '') || '0';
    return stripped;
  }).join(':');
}

function classifyIPv6(groups: string[]): Classification {
  // Parse first group as number
  const firstGroup = parseInt(groups[0], 16);

  // ::1 loopback — all groups are 0 except last which is 1
  const isLoopback = groups.slice(0, 7).every(g => parseInt(g, 16) === 0) &&
    parseInt(groups[7], 16) === 1;
  if (isLoopback) return 'loopback';

  // ff00::/8 — first byte is 0xff
  const firstByte = (firstGroup >> 8) & 0xff;
  if (firstByte === 0xff) return 'multicast';

  // fc00::/7 — first 7 bits are 1111110 (covers fc00-fdff)
  // First byte: fc = 11111100, fd = 11111101
  // First 7 bits mask: 0xfe -> fc & fe = fc, fd & fe = fc
  if ((firstByte & 0xfe) === 0xfc) return 'private';

  // fe80::/10 — first 10 bits are 1111111010 (covers fe80-febf)
  // First byte = fe, second byte high 2 bits = 10 -> 0x80-0xbf
  const secondByte = firstGroup & 0xff;
  if (firstByte === 0xfe && (secondByte & 0xc0) === 0x80) return 'link-local';

  return 'public';
}

export function parseIpAddress(input: unknown): ParsedIpAddress {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const trimmed = input.trim();

  // Try IPv4 first
  const ipv4Result = parseIPv4(trimmed);
  if (ipv4Result !== null) {
    const { octets } = ipv4Result;
    const normalized = normalizeIPv4(octets);
    const classification = classifyIPv4(octets);
    return {
      version: 4,
      address: trimmed,
      normalized,
      classification,
    };
  }

  // Try IPv6
  const ipv6Result = parseIPv6(trimmed);
  if (ipv6Result !== null) {
    const { groups } = ipv6Result;
    const normalized = normalizeIPv6(groups);
    const classification = classifyIPv6(groups);
    return {
      version: 6,
      address: trimmed,
      normalized,
      classification,
    };
  }

  throw new SyntaxError('Invalid IP address');
}