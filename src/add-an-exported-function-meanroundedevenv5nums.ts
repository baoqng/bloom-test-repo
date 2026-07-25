// bloom-deps:

export function meanRoundedEvenV5(nums: number[]): number {
  // Validate input: check for empty array
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Validate all elements are numbers
  for (const num of nums) {
    if (typeof num !== 'number' || !Number.isFinite(num)) {
      throw new TypeError(`Invalid input: expected finite number, got ${typeof num}`);
    }
  }

  // Calculate mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Round to nearest integer with banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // If exactly at 0.5 (tie case), round to nearest even
  if (fract === 0.5) {
    // floor is even, round down to floor
    if (floor % 2 === 0) {
      return floor;
    }
    // floor is odd, round up to floor + 1
    return floor + 1;
  }

  // If exactly at -0.5 for negative numbers
  if (fract === -0.5) {
    const ceil = Math.ceil(mean);
    // ceil is even, round up to ceil
    if (ceil % 2 === 0) {
      return ceil;
    }
    // ceil is odd, round down to ceil - 1
    return ceil - 1;
  }

  // Standard rounding: round to nearest
  return Math.round(mean);
}