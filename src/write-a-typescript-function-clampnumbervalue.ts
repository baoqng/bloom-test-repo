// bloom-deps:

function clampNumber(value: unknown, min: number, max: number): number {
  // Validate value is a number
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError('value must be a number');
  }

  // Validate min is a number
  if (typeof min !== 'number' || Number.isNaN(min)) {
    throw new TypeError('min must be a number');
  }

  // Validate max is a number
  if (typeof max !== 'number' || Number.isNaN(max)) {
    throw new TypeError('max must be a number');
  }

  // Validate min <= max
  if (min > max) {
    throw new RangeError('min must be less than or equal to max');
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