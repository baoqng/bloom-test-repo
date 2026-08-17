// bloom-deps:

function clampNumber(value: unknown, min: number, max: number): number {
  // Validate value is a number
  if (typeof value !== 'number' || isNaN(value)) {
    throw new TypeError(`value must be a number, got ${typeof value}`);
  }

  // Validate min is a number
  if (typeof min !== 'number' || isNaN(min)) {
    throw new TypeError(`min must be a number, got ${typeof min}`);
  }

  // Validate max is a number
  if (typeof max !== 'number' || isNaN(max)) {
    throw new TypeError(`max must be a number, got ${typeof max}`);
  }

  // Validate min <= max
  if (min > max) {
    throw new RangeError(`min (${min}) must be less than or equal to max (${max})`);
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