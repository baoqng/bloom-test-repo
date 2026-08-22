// bloom-deps:

function parseIPv4(input: string): number[] | null {
  const parts = input.split('.');
  if (parts.length !== 4) return null;
  const octets: number[] = [];
  for (const part of parts) {
    if (!/^\d+$/.test(part)) return null;
    if (part.length > 1 && part[0] === '0') return null; // no leading zeros
    const n = Number(part);
    if (!Number.isInteger(n) || n < 0 || n > 255) return null;
    octets.push(n);
  }
  return octets;
}

function expandIPv6(input: string): number[] | null {
  // Check for invalid characters
  if (!/^[0-9a-fA-F:]+$/.test(input)) return null;

  let groups: string[];

  if (input.includes('::')) {
    // Only one '::' allowed
    const doubleColonCount = (input.match(/::/g) || []).length;
    if (doubleColonCount > 1) return null;

    const sides = input.split('::');
    if (sides.length !== 2) return null;

    const left = sides[0] ? sides[0].split(':') : [];
    const right = sides[1] ? sides[1].split(':') : [];

    // Validate each group
    for (const g of [...left, ...right]) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    }

    const totalExplicit = left.length + right.length;
    if (totalExplicit > 7) return null;

    const missing = 8 - totalExplicit;
    const middle = Array(missing).fill('0');
    groups = [...left, ...middle, ...right];
  } else {
    groups = input.split(':');
    if (groups.length !== 8) return null;
    for (const g of groups) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    }
  }

  if (groups.length !== 8) return null;

  return groups.map(g => parseInt(g, 16));
}

function normalizeIPv6(values: number[]): string {
  return values.map(v => v.toString(16)).join(':');
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

function classifyIPv6(values: number[]): 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' | 'reserved' {
  // ::1 loopback
  if (values[0] === 0 && values[1] === 0 && values[2] === 0 &&
      values[3] === 0 && values[4] === 0 && values[5] === 0 &&
      values[6] === 0 && values[7] === 1) {
    return 'loopback';
  }

  const firstGroup = values[0];

  // ff00::/8 multicast — first byte is 0xff
  if ((firstGroup & 0xff00) === 0xff00) return 'multicast';

  // fe80::/10 link-local — first group: fe80–febf
  if ((firstGroup & 0xffc0) === 0xfe80) return 'link-local';

  // fc00::/7 private — first group: fc00–fdff
  if ((firstGroup & 0xfe00) === 0xfc00) return 'private';

  return 'public';
}

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
  const ipv4Octets = parseIPv4(trimmed);
  if (ipv4Octets !== null) {
    const normalized = ipv4Octets.join('.');
    const classification = classifyIPv4(ipv4Octets);
    return {
      version: 4,
      address: trimmed,
      normalized,
      classification,
    };
  }

  // Try IPv6
  const ipv6Values = expandIPv6(trimmed);
  if (ipv6Values !== null) {
    const normalized = normalizeIPv6(ipv6Values);
    const classification = classifyIPv6(ipv6Values);
    return {
      version: 6,
      address: trimmed,
      normalized,
      classification,
    };
  }

  throw new SyntaxError('Invalid IP address');
}