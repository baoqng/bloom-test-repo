// bloom-deps:
export function countInRange(nums: number[], lo: number, hi: number): number {
  if (lo > hi) return 0;
  return nums.filter(x => x >= lo && x <= hi).length;
}