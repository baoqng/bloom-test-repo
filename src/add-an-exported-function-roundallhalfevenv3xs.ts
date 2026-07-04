// bloom-deps:

export function roundAllHalfEvenV3(xs: number[]): number[] {
  // Validate that all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Round each element using banker's rounding (round-half-to-even)
  return xs.map((x) => {
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    const frac = x - floor;

    // If fraction is exactly 0.5, round to nearest even
    if (frac === 0.5) {
      const result = floor % 2 === 0 ? floor : ceil;
      // Ensure positive zero, not negative zero
      return result === 0 ? 0 : result;
    }

    // Otherwise use standard rounding
    return Math.round(x);
  });
}