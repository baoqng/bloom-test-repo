// bloom-deps:

export function countInRangeV5(nums: number[], lo: number, hi: number): number {
  if (lo > hi) {
    return 0;
  }

  let count = 0;
  for (const num of nums) {
    if (num >= lo && num <= hi) {
      count += 1;
    }
  }

  return count;
}