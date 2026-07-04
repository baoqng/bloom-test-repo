// bloom-deps:

export function countInRangeV6(nums: number[], lo: number, hi: number): number {
  if (lo > hi) {
    return 0;
  }

  return nums.filter(num => num >= lo && num <= hi).length;
}