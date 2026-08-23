// bloom-deps:

function clampNumber(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || !isFinite(value)) {
    throw new TypeError('value must be a finite number');
  }
  if (typeof min !== 'number' || !isFinite(min)) {
    throw new TypeError('min must be a finite number');
  }
  if (typeof max !== 'number' || !isFinite(max)) {
    throw new TypeError('max must be a finite number');
  }
  if (min > max) {
    throw new RangeError('min must not be greater than max');
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export { clampNumber };