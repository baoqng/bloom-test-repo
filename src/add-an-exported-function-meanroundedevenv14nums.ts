// bloom-deps:

import fs from "fs";
import path from "path";

export function meanRoundedEvenV14(nums: number[]): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (!Array.isArray(nums)) {
    throw new TypeError("input must be an array");
  }

  for (const num of nums) {
    if (typeof num !== "number" || !isFinite(num)) {
      throw new TypeError("all array elements must be finite numbers");
    }
  }

  // Empty array check
  if (nums.length === 0) {
    throw new RangeError("mean of empty array");
  }

  // Compute arithmetic mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Exact tie case: fract === 0.5
  if (fract === 0.5) {
    // Round to the nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Standard rounding for non-tie cases
  return Math.round(mean);
}

export function writeUtilsFile(filePath: string): void {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const content = `// bloom-deps:

import fs from "fs";
import path from "path";

export function meanRoundedEvenV14(nums: number[]): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (!Array.isArray(nums)) {
    throw new TypeError("input must be an array");
  }

  for (const num of nums) {
    if (typeof num !== "number" || !isFinite(num)) {
      throw new TypeError("all array elements must be finite numbers");
    }
  }

  // Empty array check
  if (nums.length === 0) {
    throw new RangeError("mean of empty array");
  }

  // Compute arithmetic mean
  const sum = nums.reduce((acc, val) => acc + val, 0);
  const mean = sum / nums.length;

  // Banker's rounding (round half to even)
  const floor = Math.floor(mean);
  const fract = mean - floor;

  // Exact tie case: fract === 0.5
  if (fract === 0.5) {
    // Round to the nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Standard rounding for non-tie cases
  return Math.round(mean);
}
`;

    fs.writeFileSync(filePath, content, "utf-8");
  } catch (error) {
    throw new Error("Failed to write utils file", { cause: error });
  }
}