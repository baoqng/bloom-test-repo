// bloom-deps:

function clampNumber(value: unknown, min: number, max: number): number {
  // Validate value is a number
  if (typeof value !== 'number' || !isFinite(value)) {
    throw new TypeError(`value must be a finite number, got ${typeof value}`);
  }

  // Validate min is a number
  if (typeof min !== 'number' || !isFinite(min)) {
    throw new TypeError(`min must be a finite number, got ${typeof min}`);
  }

  // Validate max is a number
  if (typeof max !== 'number' || !isFinite(max)) {
    throw new TypeError(`max must be a finite number, got ${typeof max}`);
  }

  // Validate min <= max
  if (min > max) {
    throw new RangeError(`min must be less than or equal to max, got min=${min} and max=${max}`);
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