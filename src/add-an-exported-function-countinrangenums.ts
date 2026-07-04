// bloom-deps:

export function countInRange(nums: number[], lo: number, hi: number): number {
  if (lo > hi) {
    return 0;
  }
  
  return nums.filter(num => num >= lo && num <= hi).length;
}