// bloom-deps:

function requirePositiveFinite(value: unknown, fieldName: string): number {
  if (typeof fieldName !== 'string') {
    throw new TypeError('fieldName must be a string');
  }

  if (typeof value !== 'number') {
    throw new TypeError(`${fieldName} must be a number`);
  }

  if (!isFinite(value)) {
    throw new TypeError(`${fieldName} must be finite`);
  }

  if (value <= 0) {
    throw new RangeError(`${fieldName} must be positive`);
  }

  return value;
}

export { requirePositiveFinite };