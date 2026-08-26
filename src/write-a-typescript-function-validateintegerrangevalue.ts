// bloom-deps:

function validateIntegerRange(value: unknown, min: unknown, max: unknown): number {
  // Validate value type
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError('value must be a number');
  }

  // Validate value is finite integer
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    throw new RangeError('value must be a finite integer');
  }

  // Validate min
  if (
    typeof min !== 'number' ||
    Number.isNaN(min) ||
    !Number.isFinite(min) ||
    !Number.isInteger(min)
  ) {
    throw new TypeError('min must be an integer');
  }

  // Validate max
  if (
    typeof max !== 'number' ||
    Number.isNaN(max) ||
    !Number.isFinite(max) ||
    !Number.isInteger(max)
  ) {
    throw new TypeError('max must be an integer');
  }

  // Validate max >= min
  if (max < min) {
    throw new RangeError('max must be greater than or equal to min');
  }

  // Validate value in range
  if (value < min || value > max) {
    throw new RangeError(`value must be between ${min} and ${max}`);
  }

  return value;
}

export { validateIntegerRange };