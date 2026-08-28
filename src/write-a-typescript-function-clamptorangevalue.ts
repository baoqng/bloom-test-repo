// bloom-deps:

export function clampToRange(value: unknown, min: unknown, max: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('value must be a finite number');
  }
  if (typeof min !== 'number' || !Number.isFinite(min)) {
    throw new TypeError('min must be a finite number');
  }
  if (typeof max !== 'number' || !Number.isFinite(max)) {
    throw new TypeError('max must be a finite number');
  }
  if (min > max) {
    throw new RangeError('min must not be greater than max');
  }
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}