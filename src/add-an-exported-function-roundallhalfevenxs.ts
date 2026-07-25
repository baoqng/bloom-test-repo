// bloom-deps:

export function roundAllHalfEven(xs: number[]): number[] {
  // Validate all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to its rounded value using banker's rounding
  return xs.map((x) => {
    // Get the integer part and fractional part
    const floor = Math.floor(x);
    const fract = x - floor;

    // Check for exact tie at 0.5 (use strict equality, not epsilon tolerance)
    if (fract === 0.5) {
      // Half-even (banker's rounding): round to nearest even integer
      return floor % 2 === 0 ? floor : floor + 1;
    }

    // For negative numbers, we need to handle the fractional part correctly
    // For x < 0, we also need to consider the ceiling case
    if (x < 0) {
      const ceil = Math.ceil(x);
      const negFract = x - ceil; // This will be negative or zero

      // Check for exact tie at -0.5
      if (negFract === -0.5) {
        // Half-even: round to nearest even integer
        return ceil % 2 === 0 ? ceil : ceil - 1;
      }

      // Round to nearest for non-tie cases
      return Math.round(x);
    }

    // For positive numbers and non-tie cases, use standard rounding
    return Math.round(x);
  });
}