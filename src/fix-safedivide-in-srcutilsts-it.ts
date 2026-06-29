// bloom-deps:

export function safeDivide(dividend: unknown, divisor: unknown): number {
  if (dividend === null || dividend === undefined) {
    throw new TypeError('dividend is required');
  }
  if (divisor === null || divisor === undefined) {
    throw new TypeError('divisor is required');
  }
  if (typeof dividend !== 'number') {
    throw new TypeError('dividend must be a number');
  }
  if (typeof divisor !== 'number') {
    throw new TypeError('divisor must be a number');
  }
  if (divisor === 0) {
    throw new RangeError('cannot divide by zero');
  }
  return dividend / divisor;
}