// bloom-deps:

export function meanRoundedEven(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const fraction = mean - floor;

  // If fraction is exactly 0.5, round to nearest even
  if (fraction === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Otherwise, use standard rounding
  return Math.round(mean);
}