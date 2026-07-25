// bloom-deps:

export function meanRoundedEvenV2(nums: number[]): number {
  // Validate input: check if array is empty
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Validate all elements are numeric
  for (const num of nums) {
    if (typeof num !== 'number' || !isFinite(num)) {
      throw new TypeError('all elements must be finite numbers');
    }
  }

  // Calculate sum
  let sum = 0;
  for (const num of nums) {
    sum += num;
  }

  // Calculate mean
  const mean = sum / nums.length;

  // Get integer and fractional parts
  const integer = Math.floor(mean);
  const fract = mean - integer;

  // If not a tie, use standard rounding (nearest)
  if (fract !== 0.5) {
    return Math.round(mean);
  }

  // Tie case: round to even
  // If integer is even, round down (return integer)
  // If integer is odd, round up (return integer + 1)
  if (integer % 2 === 0) {
    return integer;
  } else {
    return integer + 1;
  }
}