// bloom-deps:

export function meanRoundedEvenV3(nums: number[]): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (!Array.isArray(nums)) {
    throw new TypeError('Input must be an array');
  }

  for (let i = 0; i < nums.length; i++) {
    if (typeof nums[i] !== 'number' || !Number.isFinite(nums[i])) {
      throw new TypeError('All elements must be finite numbers');
    }
  }

  // Empty array check
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Calculate the sum
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }

  // Calculate the mean
  const mean = sum / nums.length;

  // Round to nearest integer with banker's rounding (round halves to even)
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Strict equality check for tie (no epsilon tolerance)
  if (fract === 0.5) {
    // Round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  } else if (fract > 0.5) {
    return floor + 1;
  } else {
    return floor;
  }
}