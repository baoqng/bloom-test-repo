// bloom-deps:

function clampNumber(value: unknown, min: number, max: number): number {
  // Validate value is a number
  if (typeof value !== 'number' || !isFinite(value)) {
    throw new TypeError(`Expected value to be a finite number, got ${typeof value}`);
  }

  // Validate min is a number
  if (typeof min !== 'number' || !isFinite(min)) {
    throw new TypeError(`Expected min to be a finite number, got ${typeof min}`);
  }

  // Validate max is a number
  if (typeof max !== 'number' || !isFinite(max)) {
    throw new TypeError(`Expected max to be a finite number, got ${typeof max}`);
  }

  // Validate min <= max
  if (min > max) {
    throw new RangeError(`Invalid range: min (${min}) cannot be greater than max (${max})`);
  }

  // Clamp value to [min, max]
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

export { clampNumber };