// bloom-deps:

export function roundAllHalfEvenV2(xs: number[]): number[] {
  // Type validation: check that all elements are finite numbers
  for (let i = 0; i < xs.length; i++) {
    const element = xs[i];
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to its banker's rounded value
  return xs.map((x) => {
    // Extract integer and fractional parts
    const floor = Math.floor(x);
    const fract = x - floor;

    // Handle exact ties (fract === 0.5)
    if (fract === 0.5) {
      // Round to nearest even: if floor is even, return floor; otherwise return floor + 1
      return floor % 2 === 0 ? floor : floor + 1;
    }

    // For negative numbers with fract === 0.5 (e.g., -2.5):
    // floor = -3, fract = 0.5
    // We want to round to the nearest even integer
    if (fract === -0.5) {
      // For negative, floor is already one less than we want
      // Check if (floor + 1) is even
      const rounded = floor + 1;
      return rounded % 2 === 0 ? rounded : floor;
    }

    // For non-tie values, use standard rounding
    return Math.round(x);
  });
}