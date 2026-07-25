// bloom-deps:

export function meanRoundedEvenV11(nums: number[]): number {
  // Type guard: validate input is an array
  if (!Array.isArray(nums)) {
    throw new TypeError('Input must be an array');
  }

  // Empty array check
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Validate all elements are numbers
  for (let i = 0; i < nums.length; i++) {
    if (typeof nums[i] !== 'number' || !isFinite(nums[i])) {
      throw new TypeError('All elements must be finite numbers');
    }
  }

  // Compute the arithmetic mean
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }
  const mean = sum / nums.length;

  // Extract integer and fractional parts
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Banker's rounding (round half to even)
  // Exact tie at 0.5: round to nearest even
  if (fract === 0.5) {
    // If floor is even, round down; if odd, round up
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Not a tie: use standard rounding (nearest)
  if (fract < 0.5) {
    return floor;
  } else {
    return floor + 1;
  }
}