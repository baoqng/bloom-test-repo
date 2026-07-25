// bloom-deps:

export function meanRoundedEvenV15(nums: number[]): number {
  // Input validation: check for empty array
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Type guard: validate all elements are numbers
  for (const num of nums) {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new TypeError('all elements must be valid numbers');
    }
  }

  // Compute the mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Extract integer and fractional parts
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Apply banker's rounding (round half to even)
  if (fract === 0.5) {
    // Exact tie: round to nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  } else if (fract > 0.5) {
    // Round up
    return floor + 1;
  } else {
    // Round down (includes fract < 0.5 and fract === 0)
    return floor;
  }
}