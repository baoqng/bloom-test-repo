export function roundAllHalfEvenV23(xs: number[]): number[] {
  // Validate that all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Create a new array with rounded values
  const result: number[] = [];
  for (const x of xs) {
    const rounded = roundHalfEven(x);
    result.push(rounded);
  }

  return result;
}

function roundHalfEven(x: number): number {
  // Get the integer and fractional parts
  // For negative numbers, we need to be careful:
  // -1.5: floor = -2, fract = -1.5 - (-2) = 0.5 ✓
  // -3.5: floor = -4, fract = -3.5 - (-4) = 0.5 ✓
  const floor = Math.floor(x);
  const fract = x - floor;

  // If not a tie (not exactly 0.5), use standard rounding
  if (fract !== 0.5) {
    return Math.round(x);
  }

  // For exact ties (fract === 0.5), apply banker's rounding:
  // Round to the nearest even integer.
  // The two candidates are floor and floor + 1 (i.e., ceil).
  // Pick the one that is even.
  if (floor % 2 === 0) {
    return floor;
  } else {
    return floor + 1;
  }
}