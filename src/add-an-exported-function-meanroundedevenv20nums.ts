// bloom-deps:

export function meanRoundedEvenV20(nums: number[]): number {
  // Input validation: check for empty array
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Input validation: check all elements are numbers
  for (const num of nums) {
    if (typeof num !== 'number' || Number.isNaN(num)) {
      throw new TypeError('all elements must be valid numbers');
    }
  }

  // Compute the arithmetic mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Extract integer and fractional parts
  const integer = Math.floor(mean);
  const fractional = mean - integer;

  // Handle the tie case (exact 0.5 fractional part) using banker's rounding (half-even)
  if (fractional === 0.5) {
    // Round to the nearest even integer
    return integer % 2 === 0 ? integer : integer + 1;
  }

  // Handle negative numbers: if mean is negative and fractional is 0.5
  if (fractional === -0.5) {
    // For negative numbers, we need to round toward the nearest even
    // When mean = -2.5, integer = -3, fractional = -2.5 - (-3) = 0.5
    // But Math.floor(-2.5) = -3, so fractional = -2.5 - (-3) = 0.5
    // We want to round to -2 (even)
    const absInteger = Math.floor(Math.abs(mean));
    return -(absInteger % 2 === 0 ? absInteger : absInteger + 1);
  }

  // For non-tie cases, use standard rounding (round to nearest)
  return Math.round(mean);
}