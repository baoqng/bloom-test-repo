// bloom-deps:

export function roundAllHalfEvenV4(xs: number[]): number[] {
  // Validate input: check that all elements are finite numbers
  for (const x of xs) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to its banker's rounded value
  return xs.map((x) => {
    // Get the integer part and fractional part
    const floor = Math.floor(x);
    const fract = x - floor;

    // Exact tie case: fract === 0.5
    if (fract === 0.5) {
      // Round to nearest even integer
      // If floor is even, return floor; if odd, return floor + 1
      return floor % 2 === 0 ? floor : floor + 1;
    }

    // Exact tie case: fract === -0.5 (for negative numbers)
    // When x is negative and fract part is exactly 0.5
    // e.g., -2.5: floor = -3, fract = 0.5
    // We need to handle this case for negative ties
    if (fract === 0.5 && x < 0) {
      // For negative numbers, we use ceiling instead
      const ceil = Math.ceil(x);
      // Round to nearest even: if ceil is even, return ceil; if odd, return ceil - 1
      return ceil % 2 === 0 ? ceil : ceil - 1;
    }

    // Non-tie case: use Math.round (which rounds away from zero for ties,
    // but we already handled exact ties above)
    return Math.round(x);
  });
}