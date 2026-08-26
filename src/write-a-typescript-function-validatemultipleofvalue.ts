// bloom-deps:

function validateMultipleOf(value: unknown, divisor: unknown): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError('value must be a number');
  }

  if (!Number.isFinite(value)) {
    throw new RangeError('value must be finite');
  }

  if (typeof divisor !== 'number' || Number.isNaN(divisor) || !Number.isFinite(divisor) || divisor === 0) {
    throw new TypeError('divisor must be a non-zero number');
  }

  if (!Number.isInteger(value / divisor)) {
    throw new RangeError(`value must be a multiple of ${divisor}`);
  }

  return value;
}

export { validateMultipleOf };