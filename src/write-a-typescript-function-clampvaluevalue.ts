// bloom-deps:

export function clampValue(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
    throw new TypeError('value, min, and max must all be numbers');
  }
  if (isNaN(value) || isNaN(min) || isNaN(max)) {
    throw new TypeError('value, min, and max must not be NaN');
  }
  if (min > max) {
    throw new TypeError('min must not be greater than max');
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}