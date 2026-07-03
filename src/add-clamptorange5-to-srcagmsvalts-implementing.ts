// bloom-deps:

export function clampToRange_5(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
    throw new TypeError('All arguments must be numbers');
  }

  if (min > max) {
    throw new RangeError('min must be less than or equal to max');
  }

  if (value >= min && value <= max) {
    return value;
  }

  if (value < min) {
    return min;
  }

  return max;
}