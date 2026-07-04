export function meanRoundedEvenV8(nums: number[]): number {
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round to nearest even)
  const floor = Math.floor(mean);
  const ceil = Math.ceil(mean);

  // If mean is exactly an integer, return it
  if (floor === ceil) {
    return floor;
  }

  const fraction = mean - floor;

  // If fraction is less than 0.5, round down
  if (fraction < 0.5) {
    return floor;
  }

  // If fraction is greater than 0.5, round up
  if (fraction > 0.5) {
    return ceil;
  }

  // If fraction is exactly 0.5, round to nearest even
  const result = floor % 2 === 0 ? floor : ceil;
  // Avoid returning -0; normalize to +0
  return result === 0 ? 0 : result;
}