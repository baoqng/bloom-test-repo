export function meanRoundedEven(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding: round to nearest even integer when exactly halfway
  const floor = Math.floor(mean);
  const ceil = Math.ceil(mean);
  const fraction = mean - floor;

  let result: number;

  // If not exactly halfway, round normally
  if (fraction < 0.5) {
    result = floor;
  } else if (fraction > 0.5) {
    result = ceil;
  } else {
    // Exactly halfway: round to even
    result = floor % 2 === 0 ? floor : ceil;
  }

  // Convert -0 to +0
  return result === 0 ? 0 : result;
}