// bloom-deps:

export function meanRoundedEvenV25(nums: number[]): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (!Array.isArray(nums)) {
    throw new TypeError('Input must be an array');
  }

  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Validate all elements are numbers
  for (let i = 0; i < nums.length; i++) {
    if (typeof nums[i] !== 'number' || !Number.isFinite(nums[i])) {
      throw new TypeError(`Element at index ${i} is not a valid number`);
    }
  }

  // Compute arithmetic mean
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
    // floor is even, round down to floor
    if (floor % 2 === 0) {
      return floor;
    }
    // floor is odd, round up to floor + 1
    return floor + 1;
  }

  // Not a tie: standard rounding (round half up for positive, half down for negative)
  if (fract > 0.5) {
    return floor + 1;
  }

  return floor;
}