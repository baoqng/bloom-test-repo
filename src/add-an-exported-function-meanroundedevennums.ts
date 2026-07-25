// bloom-deps:

export function meanRoundedEven(nums: number[]): number {
  // Type validation guard — must fire BEFORE any arithmetic
  if (!Array.isArray(nums)) {
    throw new TypeError('Input must be an array');
  }

  for (let i = 0; i < nums.length; i++) {
    if (typeof nums[i] !== 'number' || !isFinite(nums[i])) {
      throw new TypeError(`Element at index ${i} is not a valid number`);
    }
  }

  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  // Calculate mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Exact tie: fract === 0.5
  if (fract === 0.5) {
    // Round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Not a tie: round to nearest
  return Math.round(mean);
}