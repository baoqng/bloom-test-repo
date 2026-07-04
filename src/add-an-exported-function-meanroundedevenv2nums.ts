export function meanRoundedEvenV2(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const ceil = Math.ceil(mean);
  const fraction = mean - floor;

  let result: number;

  if (fraction < 0.5) {
    result = floor;
  } else if (fraction > 0.5) {
    result = ceil;
  } else {
    // Exactly 0.5: round to nearest even
    result = floor % 2 === 0 ? floor : ceil;
  }

  // Convert -0 to +0
  return result === 0 ? 0 : result;
}