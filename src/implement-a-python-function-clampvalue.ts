// bloom-deps:

/**
 * Clamps a value to the range [min_val, max_val].
 * @param value - The value to clamp.
 * @param min_val - The minimum bound (inclusive).
 * @param max_val - The maximum bound (inclusive).
 * @returns The clamped value.
 * @throws TypeError if any argument is not a finite real number.
 * @throws RangeError if min_val > max_val.
 */
export function clamp(value: number, min_val: number, max_val: number): number {
  // Validate all inputs are real finite numbers
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    throw new TypeError('value must be a finite real number');
  }
  if (typeof min_val !== 'number' || isNaN(min_val) || !isFinite(min_val)) {
    throw new TypeError('min_val must be a finite real number');
  }
  if (typeof max_val !== 'number' || isNaN(max_val) || !isFinite(max_val)) {
    throw new TypeError('max_val must be a finite real number');
  }

  // Validate min_val <= max_val
  if (min_val > max_val) {
    throw new RangeError(`min_val (${min_val}) must not be greater than max_val (${max_val})`);
  }

  // Clamp the value (boundaries are inclusive)
  if (value < min_val) {
    return min_val;
  }
  if (value > max_val) {
    return max_val;
  }
  return value;
}