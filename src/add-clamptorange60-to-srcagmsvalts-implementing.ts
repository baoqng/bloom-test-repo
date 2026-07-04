export function clampToRange_60(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number' || isNaN(value) || isNaN(min) || isNaN(max)) {
    throw new Error('All arguments must be numbers');
  }

  if (min > max) {
    throw new Error('min must be less than or equal to max');
  }

  if (value <= min) {
    return min;
  }

  if (value >= max) {
    return max;
  }

  return value;
}