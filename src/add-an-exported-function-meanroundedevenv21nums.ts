// bloom-deps:

export function meanRoundedEvenV21(nums: number[]): number {
  // Type validation: guard against invalid inputs before any arithmetic
  if (!Array.isArray(nums)) {
    throw new TypeError('Input must be an array');
  }

  for (let i = 0; i < nums.length; i++) {
    if (typeof nums[i] !== 'number' || !isFinite(nums[i])) {
      throw new TypeError('All elements must be finite numbers');
    }
  }

  // Empty array check
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Calculate mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Exact tie at 0.5: round to nearest even
  if (fract === 0.5) {
    // If floor is even, round down (return floor)
    // If floor is odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Standard rounding for non-tie cases
  return Math.round(mean);
}