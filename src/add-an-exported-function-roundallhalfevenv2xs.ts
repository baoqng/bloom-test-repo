// bloom-deps:

export function roundAllHalfEvenV2(xs: number[]): number[] {
  // Validate that all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Round each element using banker's rounding (round-half-to-even)
  return xs.map(x => {
    const floor = Math.floor(x);
    const frac = x - floor;

    // If frac is exactly 0.5, round to nearest even
    if (frac === 0.5) {
      return floor % 2 === 0 ? floor : floor + 1;
    }

    // Otherwise, use standard rounding
    return Math.round(x);
  });
}