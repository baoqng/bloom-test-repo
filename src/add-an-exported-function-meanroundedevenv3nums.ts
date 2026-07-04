// bloom-deps:

export function meanRoundedEvenV3(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding: round halves to the nearest even integer
  const floor = Math.floor(mean);
  const ceil = Math.ceil(mean);
  const fraction = mean - floor;

  // If exactly at .5, round to even
  if (fraction === 0.5) {
    return floor % 2 === 0 ? floor : ceil;
  }

  // Otherwise use standard rounding
  return Math.round(mean);
}