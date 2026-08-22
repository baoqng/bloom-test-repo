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
    return ipv4Result;
  }

  // Try IPv6
  const ipv6Result = tryParseIPv6(trimmed);
  if (ipv6Result !== null) {
    return ipv6Result;
  }

  throw new SyntaxError('Invalid IP address');
}

function tryParseIPv4(input: string): {
  version: 4;
  address: string;
  normalized: string;
  classification: 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' | 'reserved';
} | null {
  const parts = input.split('.');
  if (parts.length !== 4) return null;

  const octets: number[] = [];
  for (const part of parts) {
    if (part === '' || !/^\d+$/.test(part)) return null;
    // No leading zeros allowed (e.g. "01" is invalid)
    if (part.length > 1 && part[0] === '0') return null;
    const num = Number(part);
    if (!Number.isInteger(num) || num < 0 || num > 255) return null;
    octets.push(num);
  }

  const normalized = octets.join('.');
  const classification = classifyIPv4(octets);

  return {
    version: 4,
    address: input,
    normalized,
    classification,
  };
}

function classifyIPv4(octets: number[]): 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' | 'reserved' {
  const [a, b] = octets;

  // Loopback: 127.x.x.x
  if (a === 127) return 'loopback';

  // Private: 10.x, 172.16-31.x, 192.168.x
  if (a === 10) return 'private';
  if (a === 172 && b >= 16 && b <= 31) return 'private';
  if (a === 192 && b === 168) return 'private';

  // Link-local: 169.254.x
  if (a === 169 && b === 254) return 'link-local';

  // Multicast: 224-239.x
  if (a >= 224 && a <= 239) return 'multicast';

  // Reserved: 0.x and 240-255.x
  if (a === 0) return 'reserved';
  if (a >= 240 && a <= 255) return 'reserved';

  return 'public';
}

function tryParseIPv6(input: string): {
  version: 6;
  address: string;
  normalized: string;
  classification: 'loopback' | 'private' | 'link-local' | 'multicast' | 'public';
} | null {
  // Expand '::' compression
  const expanded = expandIPv6(input);
  if (expanded === null) return null;

  const normalized = normalizeIPv6(expanded);
  if (normalized === null) return null;

  const classification = classifyIPv6(expanded);

  return {
    version: 6,
    address: input,
    normalized,
    classification,
  };
}

function expandIPv6(input: string): string[] | null {
  // Handle '::' compression
  const doubleColonCount = (input.match(/::/g) || []).length;
  if (doubleColonCount > 1) return null;

  let groups: string[];

  if (doubleColonCount === 1) {
    const [left, right] = input.split('::');
    const leftGroups = left === '' ? [] : left.split(':');
    const rightGroups = right === '' ? [] : right.split(':');

    // Validate left and right groups
    for (const g of [...leftGroups, ...rightGroups]) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    }

    const totalExplicit = leftGroups.length + rightGroups.length;
    if (totalExplicit > 7) return null; // need at least one group for ::

    const fillCount = 8 - totalExplicit;
    const fillGroups = Array(fillCount).fill('0');
    groups = [...leftGroups, ...fillGroups, ...rightGroups];
  } else {
    groups = input.split(':');
    if (groups.length !== 8) return null;
    for (const g of groups) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    }
  }

  if (groups.length !== 8) return null;

  return groups;
}

function normalizeIPv6(groups: string[]): string | null {
  if (groups.length !== 8) return null;
  // Lowercase, remove leading zeros per group
  const normalized = groups.map(g => {
    const lower = g.toLowerCase();
    // Remove leading zeros but keep at least one digit
    return lower.replace(/^0+([0-9a-f])/, '$1');
  });
  return normalized.join(':');
}

function classifyIPv6(groups: string[]): 'loopback' | 'private' | 'link-local' | 'multicast' | 'public' {
  // Convert groups to numeric values
  const nums = groups.map(g => parseInt(g, 16));

  // Loopback: ::1 => 0:0:0:0:0:0:0:1
  if (nums.every((v, i) => i < 7 ? v === 0 : v === 1)) return 'loopback';

  // Multicast: ff00::/8 => first byte is 0xff
  const firstGroup = nums[0];
  if ((firstGroup & 0xff00) === 0xff00) return 'multicast';

  // Link-local: fe80::/10 => first 10 bits are 1111111010
  // fe80 = 1111 1110 1000 0000
  // /10 means first 10 bits: 1111111010
  // fe80 & ffc0 === fe80
  if ((firstGroup & 0xffc0) === 0xfe80) return 'link-local';

  // Private: fc00::/7 => first 7 bits are 1111110
  // fc00 = 1111 1100 0000 0000
  // /7 means first 7 bits: 1111110
  // fc00 & fe00 === fc00
  if ((firstGroup & 0xfe00) === 0xfc00) return 'private';

  return 'public';
}