// bloom-deps:

export function validateIPv4Octet(octet: unknown): number {
  if (typeof octet !== 'string') {
    throw new TypeError('octet must be a string');
  }

  if (octet.trim().length === 0) {
    throw new RangeError('octet must not be empty');
  }

  const trimmed = octet.trim();

  for (const char of trimmed) {
    if (char < '0' || char > '9') {
      throw new RangeError('octet must contain only digits');
    }
  }

  if (trimmed.length > 1 && trimmed[0] === '0') {
    throw new RangeError('octet must not have leading zeros');
  }

  const value = Number(trimmed);

  if (value > 255) {
    throw new RangeError('octet value must be between 0 and 255');
  }

  return value;
}