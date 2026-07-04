// bloom-deps:

export function roundAllHalfEven(xs: number[]): number[] {
  // Validate all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to banker's rounding (round-half-to-even)
  return xs.map((x) => {
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    const frac = x - floor;

    // If exactly halfway between two integers
    if (frac === 0.5) {
      // Round to nearest even integer
      const result = floor % 2 === 0 ? floor : ceil;
      // Ensure positive zero (not negative zero)
      return Object.is(result, -0) ? 0 : result;
    }

    // Otherwise, round normally
    return Math.round(x);
  });
}