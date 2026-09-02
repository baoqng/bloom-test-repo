// bloom-deps:

export function parseNumericRange(input: unknown): { min: number; max: number } {
  // Check if input is a string
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a non-empty string');
  }

  // Check if input is empty
  if (input.length === 0) {
    throw new TypeError('Input must be a non-empty string');
  }

  // Split on '-' and check for exactly two parts
  const parts = input.split('-');
  if (parts.length !== 2) {
    throw new TypeError('Invalid range format');
  }

  // Parse each part to a number
  const minValue = Number(parts[0]);
  const maxValue = Number(parts[1]);

  // Check if both values are finite numbers
  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
    throw new TypeError('Range bounds must be numbers');
  }

  // Check if min is strictly less than max
  if (minValue >= maxValue) {
    throw new RangeError('min must be less than max');
  }

  return { min: minValue, max: maxValue };
}