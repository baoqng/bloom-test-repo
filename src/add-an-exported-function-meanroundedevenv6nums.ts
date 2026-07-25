// bloom-deps:

export function meanRoundedEvenV6(nums: number[]): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (!Array.isArray(nums)) {
    throw new TypeError('Input must be an array');
  }

  for (let i = 0; i < nums.length; i++) {
    const element = nums[i];
    if (typeof element !== 'number' || !isFinite(element)) {
      throw new TypeError(`Invalid input at index ${i}: expected finite number, got ${typeof element}`);
    }
  }

  // Edge case: empty array
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Calculate arithmetic mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Banker's rounding: round halves to nearest EVEN integer
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Exact tie case: fract === 0.5 (use strict equality, not epsilon tolerance)
  if (fract === 0.5) {
    // Round to nearest even: if floor is even, use it; if odd, use floor + 1
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For negative numbers with exact half: e.g., mean = -2.5
  // floor = -3, fract = 0.5, we want -2 (which is even)
  if (fract === -0.5) {
    const ceil = Math.ceil(mean);
    return ceil % 2 === 0 ? ceil : ceil - 1;
  }

  // Standard rounding: round to nearest (not a tie)
  return Math.round(mean);
}