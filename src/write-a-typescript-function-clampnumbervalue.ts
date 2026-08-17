// bloom-deps:

function clampNumber(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new TypeError(`value must be a number, got ${value === null ? 'null' : typeof value}`);
  }
  if (typeof min !== 'number' || isNaN(min)) {
    throw new TypeError(`min must be a number, got ${min === null ? 'null' : typeof min}`);
  }
  if (typeof max !== 'number' || isNaN(max)) {
    throw new TypeError(`max must be a number, got ${max === null ? 'null' : typeof max}`);
  }
  if (min > max) {
    throw new RangeError(`min (${min}) must not be greater than max (${max})`);
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export { clampNumber };