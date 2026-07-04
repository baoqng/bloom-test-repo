export function meanRoundedEvenV7(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding: round halves to nearest even integer
  const floor = Math.floor(mean);
  const ceil = Math.ceil(mean);
  const remainder = mean - floor;

  let result: number;

  // If exactly at .5, round to even
  if (Math.abs(remainder - 0.5) < 1e-10) {
    result = floor % 2 === 0 ? floor : ceil;
  } else {
    // Otherwise, round normally (< 0.5 down, > 0.5 up)
    result = remainder < 0.5 ? floor : ceil;
  }

  // Avoid returning -0; convert to +0
  return result === 0 ? 0 : result;
}