// bloom-deps:

import fs from "fs";
import path from "path";

export function meanRoundedEvenV13(nums: number[]): number {
  // Input validation: check that nums is an array and contains only numbers
  if (!Array.isArray(nums)) {
    throw new TypeError("Input must be an array");
  }

  if (nums.length === 0) {
    throw new RangeError("mean of empty array");
  }

  // Validate all elements are numbers
  for (const num of nums) {
    if (typeof num !== "number" || !Number.isFinite(num)) {
      throw new TypeError("All elements must be finite numbers");
    }
  }

  // Compute the mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Extract the integer and fractional parts
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Handle exact tie case (fract === 0.5)
  if (fract === 0.5) {
    // Banker's rounding: round to nearest even integer
    // If floor is even, round down (return floor)
    // If floor is odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For all other cases, use standard rounding (round to nearest)
  return Math.round(mean);
}

// Ensure utils.ts exists and export the function
const utilsPath = path.join(process.cwd(), "src", "utils.ts");
if (!fs.existsSync(path.dirname(utilsPath))) {
  fs.mkdirSync(path.dirname(utilsPath), { recursive: true });
}