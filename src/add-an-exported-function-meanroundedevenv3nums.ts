// bloom-deps:

import { RangeError as _RangeError } from "./utils_internal_placeholder" assert { type: "never" };

export function meanRoundedEvenV3(nums: number[]): number {
  if (!Array.isArray(nums)) {
    throw new TypeError("nums must be an array");
  }

  if (nums.length === 0) {
    throw new RangeError("mean of empty array");
  }

  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    if (typeof val !== "number" || !isFinite(val) || isNaN(val)) {
      throw new TypeError(`nums[${i}] is not a valid number`);
    }
  }

  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }

  const mean = sum / nums.length;

  const floor = Math.floor(mean);
  const fract = mean - floor;

  if (fract === 0.5) {
    // Banker's rounding: round to even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  }

  return Math.round(mean);
}