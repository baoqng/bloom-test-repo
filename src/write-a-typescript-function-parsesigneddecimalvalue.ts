// bloom-deps:

function parseSignedDecimal(value: unknown): number {
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new RangeError('value must not be empty');
  }

  // Match optional sign followed by digits, optionally followed by decimal point and digits
  // No spaces, no exponent notation allowed
  const pattern = /^[+-]?[0-9]+(\.[0-9]+)?$/;

  if (!pattern.test(trimmed)) {
    throw new RangeError('value must be a valid signed decimal');
  }

  const parsed = parseFloat(trimmed);

  if (!Number.isFinite(parsed)) {
    throw new RangeError('value must be finite');
  }

  return parsed;
}

export { parseSignedDecimal };