// bloom-deps:

export function roundAllHalfEvenV18(xs: number[]): number[] {
  const result: number[] = [];

  for (const x of xs) {
    // Validate that element is finite
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }

    // Extract the fractional part
    const floor = Math.floor(x);
    const fract = x - floor;

    let rounded: number;

    // Check for exact tie (0.5)
    if (fract === 0.5) {
      // Round to nearest even: if floor is even, round down; if odd, round up
      rounded = floor % 2 === 0 ? floor : floor + 1;
    } else if (fract === -0.5) {
      // For negative numbers, handle the tie case
      // floor is already one less than the integer part for negatives
      // e.g., Math.floor(-1.5) = -2, so fract = -1.5 - (-2) = 0.5 (positive)
      // Actually for x = -1.5: floor = -2, fract = -1.5 - (-2) = 0.5
      // We need to recalculate for negative case
      const intPart = Math.trunc(x); // truncate towards zero
      const fracPart = x - intPart;

      if (fracPart === -0.5) {
        rounded = intPart % 2 === 0 ? intPart : intPart - 1;
      } else {
        rounded = Math.round(x);
      }
    } else {
      // Not a tie, use standard rounding
      rounded = Math.round(x);
    }

    result.push(rounded);
  }

  return result;
}