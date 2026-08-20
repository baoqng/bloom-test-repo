// bloom-deps:

function clamp(value: unknown, min: unknown, max: unknown): number {
  // Validate value is a finite number
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('Expected finite number');
  }

  // Validate min is a finite number
  if (typeof min !== 'number' || !Number.isFinite(min)) {
    throw new TypeError('Expected finite number');
  }

  // Validate max is a finite number
  if (typeof max !== 'number' || !Number.isFinite(max)) {
    throw new TypeError('Expected finite number');
  }

  // Validate min <= max
  if (min > max) {
    throw new RangeError('min must be <= max');
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

export { clamp };