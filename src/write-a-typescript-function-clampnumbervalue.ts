// bloom-deps:

function clampNumber(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new TypeError(`Expected value to be a number, got ${value === null ? 'null' : typeof value}`);
  }
  if (typeof min !== 'number' || isNaN(min)) {
    throw new TypeError(`Expected min to be a number, got ${min === null ? 'null' : typeof min}`);
  }
  if (typeof max !== 'number' || isNaN(max)) {
    throw new TypeError(`Expected max to be a number, got ${max === null ? 'null' : typeof max}`);
  }

  if (min > max) {
    throw new RangeError(`min (${min}) must not be greater than max (${max})`);
  }

  if (value <= min) {
    return min;
  }
  if (value >= max) {
    return max;
  }
  return value;
}

export { clampNumber };