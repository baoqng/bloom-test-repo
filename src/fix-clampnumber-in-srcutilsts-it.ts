// bloom-deps:

export function clampNumber(value: unknown, min: unknown, max: unknown): number {
  if (value === null || value === undefined) {
    throw new TypeError('value is required');
  }
  if (min === null || min === undefined) {
    throw new TypeError('min is required');
  }
  if (max === null || max === undefined) {
    throw new TypeError('max is required');
  }
  if (typeof value !== 'number') {
    throw new TypeError('value must be a number');
  }
  if (typeof min !== 'number') {
    throw new TypeError('min must be a number');
  }
  if (typeof max !== 'number') {
    throw new TypeError('max must be a number');
  }
  if (min > max) {
    throw new RangeError('min cannot be greater than max');
  }
  return Math.min(Math.max(value, min), max);
}