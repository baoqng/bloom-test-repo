// bloom-deps:

export function meanRoundedEvenV4(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const remainder = mean - floor;

  // If remainder is less than 0.5, round down
  if (remainder < 0.5) {
    return floor;
  }

  // If remainder is greater than 0.5, round up
  if (remainder > 0.5) {
    return floor + 1;
  }

  // If remainder is exactly 0.5, round to nearest even
  const floor_is_even = floor % 2 === 0;
  return floor_is_even ? floor : floor + 1;
}