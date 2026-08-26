// bloom-deps:

function validateBitmask(value: unknown): number {
  if (typeof value !== 'number') {
    throw new TypeError('Expected a number');
  }
  if (!isFinite(value)) {
    throw new TypeError('Value must be finite');
  }
  if (Object.is(value, -0) || value < 0 || !Number.isInteger(value)) {
    throw new RangeError('Value must be a non-negative integer');
  }
  if (value > 0xFFFFFFFF) {
    throw new RangeError('Value exceeds 32-bit unsigned range');
  }
  return value;
}

export { validateBitmask };