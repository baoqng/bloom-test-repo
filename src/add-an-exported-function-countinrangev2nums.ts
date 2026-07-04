// bloom-deps:
import { filterByMinimumScore } from './utils';

export function countInRangeV2(nums: number[], lo: number, hi: number): number {
  if (lo > hi) {
    return 0;
  }
  const inRange = nums.filter((x) => x >= lo && x <= hi);
  return inRange.length;
}