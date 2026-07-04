export function meanRoundedEven(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding: round halves to the nearest even integer
  const floor = Math.floor(mean);
  const remainder = mean - floor;

  // If exactly at 0.5, round to even
  if (Math.abs(remainder - 0.5) < Number.EPSILON) {
    // Round to nearest even: if floor is even, return floor, else return floor + 1
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Otherwise, round normally
  return Math.round(mean);
}