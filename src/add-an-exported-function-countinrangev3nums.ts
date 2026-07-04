// bloom-deps:

export function countInRangeV3(nums: number[], lo: number, hi: number): number {
  if (lo > hi) {
    return 0;
  }

  let count = 0;
  for (const num of nums) {
    if (num >= lo && num <= hi) {
      count++;
    }
  }

  return count;
}