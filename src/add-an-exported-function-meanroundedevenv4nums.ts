// bloom-deps:

export function meanRoundedEvenV4(nums: number[]): number {
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

  // Apply banker's rounding (round half to even)
  if (fract === 0.5) {
    // Exact tie: round to nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  } else if (fract < 0.5) {
    // Closer to floor
    return floor;
  } else {
    // Closer to ceiling (fract > 0.5)
    return floor + 1;
  }
}