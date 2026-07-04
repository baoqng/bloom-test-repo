export function meanRoundedEvenV7(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, num) => acc + num, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const ceil = Math.ceil(mean);
  const fraction = mean - floor;

  // If exactly halfway between two integers
  if (fraction === 0.5) {
    // Round to the even number
    const result = floor % 2 === 0 ? floor : ceil;
    // Ensure we return +0 instead of -0
    return result === 0 ? 0 : result;
  }

  // Otherwise use standard rounding
  const result = Math.round(mean);
  return result === 0 ? 0 : result;
}