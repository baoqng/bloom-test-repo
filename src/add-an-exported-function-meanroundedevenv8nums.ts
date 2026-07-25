// bloom-deps:

export function meanRoundedEvenV8(nums: number[]): number {
  // Type validation: ensure nums is an array
  if (!Array.isArray(nums)) {
    throw new TypeError('Input must be an array');
  }

  // Empty array check
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Validate all elements are numbers
  for (const num of nums) {
    if (typeof num !== 'number' || Number.isNaN(num)) {
      throw new TypeError('All elements must be valid numbers');
    }
  }

  // Calculate sum
  let sum = 0;
  for (const num of nums) {
    sum += num;
  }

  // Calculate mean
  const mean = sum / nums.length;

  // Extract integer and fractional parts
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // No rounding needed
  if (fract === 0) {
    return floor;
  }

  // Round to nearest, away from zero for non-tie cases
  if (fract < 0.5) {
    return floor;
  }

  if (fract > 0.5) {
    return floor + 1;
  }

  // Exact tie at 0.5: round to nearest even
  if (fract === 0.5) {
    // If floor is even, stay at floor; if odd, go to floor+1
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Fallback (should not reach here)
  return Math.round(mean);
}