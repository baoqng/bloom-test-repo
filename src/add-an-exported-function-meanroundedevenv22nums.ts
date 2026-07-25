// bloom-deps:

export function meanRoundedEvenV22(nums: number[]): number {
  // Input validation - check for empty array
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Type validation - ensure all elements are numbers
  for (const num of nums) {
    if (typeof num !== 'number' || !Number.isFinite(num)) {
      throw new TypeError(`Invalid input: expected finite number, got ${typeof num}`);
    }
  }

  // Calculate the mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Extract the integer and fractional parts
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Handle exact tie case (half_even / banker's rounding)
  if (fract === 0.5) {
    // Round to nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Handle exact tie case for negative numbers
  if (fract === -0.5) {
    // For negative, -0.5 rounds to nearest even
    // floor is already the lower integer, so floor + 1 is the upper one
    const upper = floor + 1;
    return upper % 2 === 0 ? upper : floor;
  }

  // For non-tie cases, round to nearest integer using standard rounding
  return Math.round(mean);
}