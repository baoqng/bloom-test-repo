// bloom-deps:

export function clamp(value: number, min: number, max: number): number {
  // Validate value is a finite number
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    throw new TypeError('value must be a finite number');
  }

  // Validate min is a finite number
  if (typeof min !== 'number' || isNaN(min) || !isFinite(min)) {
    throw new TypeError('min must be a finite number');
  }

  // Validate max is a finite number
  if (typeof max !== 'number' || isNaN(max) || !isFinite(max)) {
    throw new TypeError('max must be a finite number');
  }

  // Validate min <= max constraint
  if (min > max) {
    throw new TypeError('min must be <= max');
  }

  // Clamp value to [min, max] range
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}