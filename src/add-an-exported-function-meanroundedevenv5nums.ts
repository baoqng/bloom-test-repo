// bloom-deps:

export function meanRoundedEvenV5(nums: number[]): number {
  // Input validation: check for empty array
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Type validation: ensure all elements are numbers
  for (const num of nums) {
    if (typeof num !== 'number' || !Number.isFinite(num)) {
      throw new TypeError(`Invalid input: expected finite number, got ${typeof num}`);
    }
  }

  // Calculate the sum
  let sum = 0;
  for (const num of nums) {
    sum += num;
  }

  // Calculate the mean
  const mean = sum / nums.length;

  // Banker's rounding: round halves to the nearest EVEN integer
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Exact tie at 0.5: round to nearest even
  if (fract === 0.5) {
    // If floor is even, round down (return floor)
    // If floor is odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For negative numbers with fractional part exactly 0.5
  if (fract === -0.5) {
    // This case doesn't occur with Math.floor, but handle via ceiling
    const ceil = Math.ceil(mean);
    if (ceil % 2 === 0) {
      return ceil;
    } else {
      return ceil - 1;
    }
  }

  // Not a tie: use standard rounding
  return Math.round(mean);
}