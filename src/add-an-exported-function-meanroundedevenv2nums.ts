// bloom-deps:

export function meanRoundedEvenV2(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding: round halves to the nearest even integer
  const floor = Math.floor(mean);
  const ceil = Math.ceil(mean);
  const fraction = mean - floor;

  // If not a half, use standard rounding
  if (Math.abs(fraction - 0.5) > Number.EPSILON) {
    return Math.round(mean);
  }

  // For exact halves, round to the nearest even integer
  const result = floor % 2 === 0 ? floor : ceil;
  return Object.is(result, -0) ? 0 : result;
}