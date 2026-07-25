// bloom-deps:

export function meanRoundedEvenV10(nums: number[]): number {
  // Validate input: check that nums is an array
  if (!Array.isArray(nums)) {
    throw new TypeError('Input must be an array');
  }

  // Validate that array is not empty
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Validate that all elements are numbers
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (typeof num !== 'number' || !isFinite(num)) {
      throw new TypeError('All elements must be finite numbers');
    }
  }

  // Calculate the sum
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }

  // Calculate the mean
  const mean = sum / nums.length;

  // Get the integer and fractional parts
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Handle exact tie (0.5): round to nearest even
  if (fract === 0.5) {
    // If floor is even, round down (return floor); if odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For all other cases, use standard rounding (nearest integer)
  return Math.round(mean);
}