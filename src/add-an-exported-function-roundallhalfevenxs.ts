// bloom-deps:

export function roundAllHalfEven(xs: number[]): number[] {
  // Validate that all elements are finite numbers
  for (const element of xs) {
    if (typeof element !== 'number' || !isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to its rounded value using banker's rounding
  return xs.map((x) => {
    const floor = Math.floor(x);
    const fract = x - floor;

    // Exact tie case: round to nearest even
    if (fract === 0.5) {
      // floor is even, round down
      if (floor % 2 === 0) {
        return floor;
      }
      // floor is odd, round up
      return floor + 1;
    }

    // Exact tie case: negative numbers
    if (fract === -0.5) {
      const ceiling = Math.ceil(x);
      // ceiling is even, round up (toward ceiling)
      if (ceiling % 2 === 0) {
        return ceiling;
      }
      // ceiling is odd, round down (toward floor)
      return floor;
    }

    // Non-tie case: round to nearest integer
    return Math.round(x);
  });
}