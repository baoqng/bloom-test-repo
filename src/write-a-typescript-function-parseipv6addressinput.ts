// bloom-deps:

export function parseIpv6Address(input: unknown): string {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Count occurrences of '::'
  let doubleColonCount = 0;
  let searchStart = 0;
  while (true) {
    const idx = input.indexOf('::', searchStart);
    if (idx === -1) break;
    doubleColonCount++;
    searchStart = idx + 2;
  }

  if (doubleColonCount > 1) {
    throw new SyntaxError('Not a valid IPv6 address');
  }

  const hexGroupRegex = /^[0-9a-fA-F]{1,4}$/;

  if (doubleColonCount === 1) {
    // Split on '::'
    const dcIdx = input.indexOf('::');
    const leftPart = input.slice(0, dcIdx);
    const rightPart = input.slice(dcIdx + 2);

    const leftGroups: string[] = [];
    const rightGroups: string[] = [];

    if (leftPart.length > 0) {
      const parts = leftPart.split(':');
      for (const part of parts) {
        if (!hexGroupRegex.test(part)) {
          throw new SyntaxError('Not a valid IPv6 address');
        }
        leftGroups.push(part);
      }
    }

    if (rightPart.length > 0) {
      const parts = rightPart.split(':');
      for (const part of parts) {
        if (!hexGroupRegex.test(part)) {
          throw new SyntaxError('Not a valid IPv6 address');
        }
        rightGroups.push(part);
      }
    }

    const totalExplicit = leftGroups.length + rightGroups.length;
    if (totalExplicit > 7) {
      throw new SyntaxError('Not a valid IPv6 address');
    }

    const zeroGroupCount = 8 - totalExplicit;
    const zeroGroups = Array(zeroGroupCount).fill('0000');

    const allGroups = [
      ...leftGroups.map(g => g.toLowerCase().padStart(4, '0')),
      ...zeroGroups,
      ...rightGroups.map(g => g.toLowerCase().padStart(4, '0')),
    ];

    return allGroups.join(':');
  } else {
    // Full form: must have exactly 8 groups
    const parts = input.split(':');
    if (parts.length !== 8) {
      throw new SyntaxError('Not a valid IPv6 address');
    }

    const result: string[] = [];
    for (const part of parts) {
      if (!hexGroupRegex.test(part)) {
        throw new SyntaxError('Not a valid IPv6 address');
      }
      result.push(part.toLowerCase().padStart(4, '0'));
    }

    return result.join(':');
  }
}