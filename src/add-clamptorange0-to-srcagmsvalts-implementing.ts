export function clampToRange_0(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
    throw new TypeError('All arguments must be numbers');
  }

  if (Number.isNaN(value) || Number.isNaN(min) || Number.isNaN(max)) {
    throw new TypeError('All arguments must be numbers');
  }

  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
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