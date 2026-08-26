// bloom-deps:

export function validateDivisorValue(value: unknown): number {
  // Check if value is a number
  if (typeof value !== 'number') {
    throw new TypeError('Expected a number');
  }

  // Check if value is NaN, Infinity, or -Infinity
  if (!isFinite(value)) {
    throw new TypeError('Value must be finite');
  }

  // Check if value is 0 or -0
  if (value === 0 || Object.is(value, -0)) {
    throw new RangeError('Divisor must not be zero');
  }

  // Return the validated number
  return value;
}