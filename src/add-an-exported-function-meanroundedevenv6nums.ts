// bloom-deps:

import { readFileSync, writeFileSync } from 'fs';

export function meanRoundedEvenV6(nums: number[]): number {
  if (nums.length === 0) {
    throw new RangeError('mean of empty array');
  }

  const sum = nums.reduce((acc, n) => acc + n, 0);
  const mean = sum / nums.length;

  const floor = Math.floor(mean);
  const fraction = mean - floor;

  if (fraction < 0.5) {
    return floor;
  } else if (fraction > 0.5) {
    return floor + 1;
  } else {
    // Exactly 0.5 — round to nearest even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  }
}