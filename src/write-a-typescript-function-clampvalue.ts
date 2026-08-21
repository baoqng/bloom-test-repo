// bloom-deps:

function clamp(value: unknown, min: unknown, max: unknown): number {
  if (typeof value !== 'number' || !isFinite(value)) {
    throw new TypeError('Expected finite number');
  }
  if (typeof min !== 'number' || !isFinite(min)) {
    throw new TypeError('Expected finite number');
  }
  if (typeof max !== 'number' || !isFinite(max)) {
    throw new TypeError('Expected finite number');
  }
  if (min > max) {
    throw new RangeError('min must be <= max');
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export { clamp };