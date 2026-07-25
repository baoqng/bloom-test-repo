// bloom-deps:

export function meanRoundedEvenV6(nums: number[]): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (!Array.isArray(nums)) {
    throw new TypeError('Input must be an array');
  }

  for (const num of nums) {
    if (typeof num !== 'number' || !isFinite(num)) {
      throw new TypeError('All elements must be finite numbers');
    }
  }

  // Empty array check
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Compute arithmetic mean
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