// bloom-deps:
import { filter } from "lodash";

export function countInRangeV4(nums: number[], lo: number, hi: number): number {
  if (lo > hi) {
    return 0;
  }
  return nums.filter(x => x >= lo && x <= hi).length;
}