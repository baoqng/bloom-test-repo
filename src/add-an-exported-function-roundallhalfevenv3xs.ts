// bloom-deps:

export function roundAllHalfEvenV3(xs: number[]): number[] {
  // Validate all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Return new array with rounded values, preserving order
  return xs.map((x) => {
    // Get the integer part and fractional part
    const floor = Math.floor(x);
    const fract = x - floor;

    // If fractional part is exactly 0.5, apply banker's rounding (round to even)
    if (fract === 0.5) {
      // Round to nearest even integer
      return floor % 2 === 0 ? floor : floor + 1;
    }

    // For negative numbers with fractional part exactly -0.5
    if (fract === -0.5) {
      const ceil = Math.ceil(x);
      return ceil % 2 === 0 ? ceil : ceil - 1;
    }

    // Standard rounding for all other cases
    return Math.round(x);
  });
}