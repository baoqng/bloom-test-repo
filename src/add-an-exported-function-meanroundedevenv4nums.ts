// bloom-deps:

export function meanRoundedEvenV4(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  const floor = Math.floor(mean);
  const diff = mean - floor;

  if (diff < 0.5) {
    return floor;
  } else if (diff > 0.5) {
    return floor + 1;
  } else {
    // Exact half: round to nearest even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  }
}