// bloom-deps:

function validatePercent(value: unknown): number {
  if (typeof value !== 'number') {
    throw new TypeError('Expected a number');
  }

  if (!isFinite(value) || isNaN(value)) {
    throw new TypeError('Value must be finite');
  }

  if (Object.is(value, -0)) {
    throw new RangeError('Percentage must be between 0 and 100');
  }

  if (value < 0 || value > 100) {
    throw new RangeError('Percentage must be between 0 and 100');
  }

  return value;
}

export { validatePercent };