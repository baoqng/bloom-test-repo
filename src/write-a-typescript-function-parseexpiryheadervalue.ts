// bloom-deps:

export function parseExpiryHeader(value: unknown): Date {
  if (typeof value !== 'string' || value === '') {
    throw new TypeError('value must be a non-empty string');
  }

  const parsed = new Date(value);

  if (isNaN(parsed.getTime())) {
    throw new RangeError('Invalid or expired date');
  }

  if (parsed.getTime() <= Date.now()) {
    throw new RangeError('Invalid or expired date');
  }

  return parsed;
}