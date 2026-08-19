// bloom-deps:

export function clamp(value: number, min_val: number, max_val: number): number {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    throw new TypeError('value must be a finite real number');
  }
  if (typeof min_val !== 'number' || isNaN(min_val) || !isFinite(min_val)) {
    throw new TypeError('min_val must be a finite real number');
  }
  if (typeof max_val !== 'number' || isNaN(max_val) || !isFinite(max_val)) {
    throw new TypeError('max_val must be a finite real number');
  }

  if (min_val > max_val) {
    throw new RangeError('min_val must not be greater than max_val');
  }

  if (value < min_val) {
    return min_val;
  }
  if (value > max_val) {
    return max_val;
  }
  return value;
}