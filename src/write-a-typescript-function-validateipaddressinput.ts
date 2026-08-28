// bloom-deps:

function validateIpAddress(input: unknown): { version: 4 | 6; address: string } {
  // Validate input is a non-empty string
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  const trimmedInput = input.trim();
  if (trimmedInput.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Try to parse as IPv4
  const ipv4Result = parseIPv4(trimmedInput);
  if (ipv4Result !== null) {
    return { version: 4, address: ipv4Result };
  }

  // Try to parse as IPv6
  const ipv6Result = parseIPv6(trimmedInput);
  if (ipv6Result !== null) {
    return { version: 6, address: ipv6Result };
  }

  // Neither IPv4 nor IPv6
  throw new SyntaxError('Not a valid IP address');
}

function parseIPv4(input: string): string | null {
  const parts = input.split('.');
  
  if (parts.length !== 4) {
    return null;
  }

  const octets: number[] = [];
  
  for (const part of parts) {
    // Each part must be a non-empty string of digits
    if (part.length === 0 || !/^\d+$/.test(part)) {
      return null;
    }

    // Check for leading zeros
    if (part.length > 1 && part[0] === '0') {
      return null;
    }

    const octetValue = parseInt(part, 10);

    // Check range
    if (octetValue < 0 || octetValue > 255) {
      return null;
    }

    octets.push(octetValue);
  }

  return octets.map(oct => oct.toString()).join('.');
}

function parseIPv6(input: string): string | null {
  const address = input.toLowerCase();
  
  // Check for valid characters
  if (!/^[0-9a-f:]+$/.test(address)) {
    return null;
  }

  // Count colons
  const colonCount = (address.match(/:/g) || []).length;
  
  if (colonCount < 2 || colonCount > 7) {
    return null;
  }

  // Check for double colon (compression)
  const doubleColonCount = (address.match(/::/g) || []).length;
  
  if (doubleColonCount > 1) {
    return null;
  }

  let groups: string[];

  if (doubleColonCount === 1) {
    // Compressed format with ::
    const doubleColonIndex = address.indexOf('::');
    const before = address.substring(0, doubleColonIndex);
    const after = address.substring(doubleColonIndex + 2);

    const beforeGroups = before.length > 0 ? before.split(':') : [];
    const afterGroups = after.length > 0 ? after.split(':') : [];

    // Validate all groups are valid hex
    const allGroups = [...beforeGroups, ...afterGroups];
    for (const group of allGroups) {
      if (group.length === 0 || group.length > 4 || !/^[0-9a-f]+$/.test(group)) {
        return null;
      }
    }

    const numGroups = beforeGroups.length + afterGroups.length;
    if (numGroups >= 8) {
      return null;
    }

    const zerosNeeded = 8 - numGroups;
    groups = [
      ...beforeGroups,
      ...Array(zerosNeeded).fill('0000'),
      ...afterGroups
    ];
  } else {
    // Full format, no compression
    groups = address.split(':');

    if (groups.length !== 8) {
      return null;
    }

    // Validate all groups are valid hex
    for (const group of groups) {
      if (group.length === 0 || group.length > 4 || !/^[0-9a-f]+$/.test(group)) {
        return null;
      }
    }
  }

  // Normalize each group to 4 digits with leading zeros
  const normalizedGroups = groups.map(group => group.padStart(4, '0'));

  return normalizedGroups.join(':');
}

export { validateIpAddress };