// bloom-deps:

export function meanRoundedEven(nums: number[]): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (!Array.isArray(nums)) {
    throw new TypeError('Input must be an array');
  }

  for (let i = 0; i < nums.length; i++) {
    if (typeof nums[i] !== 'number' || !Number.isFinite(nums[i])) {
      throw new TypeError(`Invalid input: element at index ${i} is not a valid number`);
    }
  }

  // Empty array check
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Calculate sum
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }

  // Calculate mean
  const mean = sum / nums.length;

  // Get the fractional part
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Apply banker's rounding (round half to even)
  if (fract === 0.5) {
    // Tie case: round to the nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  } else if (fract < 0.5) {
    // Round down
    return floor;
  } else {
    // Round up
    return floor + 1;
  }
}