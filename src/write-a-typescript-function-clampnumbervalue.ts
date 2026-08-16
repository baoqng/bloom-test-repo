// bloom-deps:

function clampNumber(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || !isFinite(value)) {
    throw new TypeError(`Expected value to be a number, got ${typeof value}`);
  }
  if (typeof min !== 'number' || !isFinite(min)) {
    throw new TypeError(`Expected min to be a number, got ${typeof min}`);
  }
  if (typeof max !== 'number' || !isFinite(max)) {
    throw new TypeError(`Expected max to be a number, got ${typeof max}`);
  }
  if (min > max) {
    throw new RangeError(`min (${min}) must not be greater than max (${max})`);
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export { clampNumber };