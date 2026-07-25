// bloom-deps:

export function meanRoundedEvenV24(nums: number[]): number {
  // Input validation: check for empty array
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Input validation: check that all elements are numbers
  for (const num of nums) {
    if (typeof num !== 'number' || !Number.isFinite(num)) {
      throw new TypeError(`Invalid input: expected finite number, got ${typeof num}`);
    }
  }

  // Calculate the sum without mutating the input array
  let sum = 0;
  for (const num of nums) {
    sum += num;
  }

  // Calculate the mean
  const mean = sum / nums.length;

  // Extract the integer and fractional parts
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Handle the tie case (exact 0.5): round to nearest even
  if (fract === 0.5) {
    // If floor is even, round down (return floor)
    // If floor is odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Handle negative numbers with exact 0.5 fractional part
  // For negative numbers, Math.floor rounds toward negative infinity
  // e.g., Math.floor(-1.5) = -2, so fract = -1.5 - (-2) = 0.5
  if (fract === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For all other cases, round to nearest integer using standard rounding
  return Math.round(mean);
}