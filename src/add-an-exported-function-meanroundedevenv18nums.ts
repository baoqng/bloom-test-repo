// bloom-deps:

export function meanRoundedEvenV18(nums: number[]): number {
  // Input validation - check for empty array
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Validate all elements are numbers
  for (const num of nums) {
    if (typeof num !== 'number' || !Number.isFinite(num)) {
      throw new TypeError(`Invalid input: expected finite number, got ${typeof num}`);
    }
  }

  // Calculate the mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Implement banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const ceil = Math.ceil(mean);
  const fract = mean - floor;

  // If not a tie, use standard rounding
  if (fract !== 0.5) {
    return Math.round(mean);
  }

  // For exact ties (fract === 0.5), round to the nearest even integer
  // If floor is even, round down; if ceil is even, round up
  return floor % 2 === 0 ? floor : ceil;
}