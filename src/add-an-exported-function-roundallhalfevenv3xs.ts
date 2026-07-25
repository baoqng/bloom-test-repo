// bloom-deps:

export function roundAllHalfEvenV3(xs: number[]): number[] {
  // Validate input: check that all elements are finite numbers
  for (const element of xs) {
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Create new array with rounded values; preserve order
  return xs.map((x) => {
    const floor = Math.floor(x);
    const fract = x - floor;

    // If exactly at a tie (0.5), apply half-even rule
    if (fract === 0.5) {
      // Round to the nearest even integer
      return floor % 2 === 0 ? floor : floor + 1;
    }

    // For negative numbers exactly at -0.5
    if (fract === -0.5) {
      const ceil = Math.ceil(x);
      return ceil % 2 === 0 ? ceil : ceil - 1;
    }

    // Not a tie: use standard rounding (nearest integer)
    return Math.round(x);
  });
}