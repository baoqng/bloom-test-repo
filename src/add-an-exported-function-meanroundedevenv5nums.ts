// bloom-deps:

export function meanRoundedEvenV5(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const fraction = mean - floor;

  if (fraction < 0.5) {
    return floor;
  } else if (fraction > 0.5) {
    return floor + 1;
  } else {
    // Exactly 0.5 - round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  }
}