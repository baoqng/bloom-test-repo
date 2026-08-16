// bloom-deps:

export function clampNumber(value: unknown, min: number, max: number): number {
  // Input validation guard - check all three parameters are numbers
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError(`value must be a number, received ${typeof value}`);
  }
  if (typeof min !== 'number' || Number.isNaN(min)) {
    throw new TypeError(`min must be a number, received ${typeof min}`);
  }
  if (typeof max !== 'number' || Number.isNaN(max)) {
    throw new TypeError(`max must be a number, received ${typeof max}`);
  }

  // Business rule validation - min must not be greater than max
  if (min > max) {
    throw new RangeError(`min (${min}) must not be greater than max (${max})`);
  }

  // Clamp value to [min, max] range using >= and <= for inclusive bounds
  if (value <= min) {
    return min;
  }
  if (value >= max) {
    return max;
  }
  return value;
}