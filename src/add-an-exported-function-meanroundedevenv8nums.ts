// bloom-deps:

export function meanRoundedEvenV8(nums: number[]): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (!Array.isArray(nums)) {
    throw new TypeError('Input must be an array');
  }

  for (let i = 0; i < nums.length; i++) {
    if (typeof nums[i] !== 'number' || !Number.isFinite(nums[i])) {
      throw new TypeError(`Invalid input at index ${i}: expected finite number, got ${typeof nums[i]}`);
    }
  }

  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Calculate the mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round half to nearest even)
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Exact tie: fractional part is exactly 0.5
  if (fract === 0.5) {
    // Round to nearest even: if floor is even, return floor; if odd, return floor + 1
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Not a tie: use standard rounding
  return Math.round(mean);
}