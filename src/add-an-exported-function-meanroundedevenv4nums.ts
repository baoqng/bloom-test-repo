// bloom-deps:

export function meanRoundedEvenV4(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding: round halves to nearest even integer
  const floor = Math.floor(mean);
  const ceil = Math.ceil(mean);
  const remainder = mean - floor;

  // If exactly at 0.5, round to the nearest even number
  if (Math.abs(remainder - 0.5) < Number.EPSILON) {
    const result = floor % 2 === 0 ? floor : ceil;
    // Ensure positive zero is returned (not negative zero)
    return Object.is(result, -0) ? 0 : result;
  }

  // Otherwise, use standard rounding
  return Math.round(mean);
}