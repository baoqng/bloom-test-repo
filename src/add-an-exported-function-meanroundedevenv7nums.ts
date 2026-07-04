// bloom-deps:

export function meanRoundedEvenV7(nums: number[]): number {
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding: round halves to nearest even integer
  const floor = Math.floor(mean);
  const fraction = mean - floor;

  // If exactly at .5, round to even
  if (Math.abs(fraction - 0.5) < 1e-10) {
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Otherwise use standard rounding
  return Math.round(mean);
}