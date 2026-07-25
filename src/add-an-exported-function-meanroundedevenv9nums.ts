// bloom-deps:

export function meanRoundedEvenV9(nums: number[]): number {
  // Validate input is an array
  if (!Array.isArray(nums)) {
    throw new TypeError('Input must be an array');
  }

  // Check for empty array
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Validate all elements are numbers
  for (const num of nums) {
    if (typeof num !== 'number' || !Number.isFinite(num)) {
      throw new TypeError('All elements must be finite numbers');
    }
  }

  // Calculate the mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Extract integer and fractional parts
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Handle exact tie (0.5): round to nearest even
  if (fract === 0.5) {
    // If floor is even, round down (return floor); if odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Handle negative exact tie (-0.5): round to nearest even
  if (fract === -0.5) {
    // For negative numbers: floor is the more negative integer
    // We need the nearest even integer to the exact halfway point
    const ceil = Math.ceil(mean);
    return ceil % 2 === 0 ? ceil : floor;
  }

  // For all other values, use standard rounding (nearest integer)
  return Math.round(mean);
}