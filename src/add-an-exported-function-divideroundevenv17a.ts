// bloom-deps:

import fs from 'fs';
import path from 'path';

export function divideRoundEvenV17(a: number, b: number): number {
  // Input validation - check types before any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }

  if (isNaN(a) || isNaN(b)) {
    throw new TypeError('Arguments must be valid numbers');
  }

  // Check for division by zero
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  // Perform the division
  const result = a / b;

  // Extract the integer and fractional parts
  const floor = Math.floor(result);
  const fract = result - floor;

  // If not a tie (exact 0.5), use standard rounding
  if (fract !== 0.5) {
    return Math.round(result);
  }

  // Handle exact tie (0.5): round to nearest even integer
  // floor is the lower integer, floor + 1 is the upper integer
  const lower = floor;
  const upper = floor + 1;

  // Return whichever is even
  if (lower % 2 === 0) {
    return lower;
  } else {
    return upper;
  }
}

// Ensure src/utils.ts exists with proper structure
const ensureUtilsFile = (): void => {
  try {
    const srcDir = path.join(process.cwd(), 'src');
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
    }
  } catch (err) {
    throw new Error('Failed to ensure src directory exists', { cause: err });
  }
};

// Initialize on module load
ensureUtilsFile();