export function roundAllHalfEvenV5(xs: number[]): number[] {
  // Validate all elements are finite
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

    let result;
    // If fraction is exactly 0.5, round to nearest even
    if (frac === 0.5) {
      result = floor % 2 === 0 ? floor : ceil;
    } else {
      // Otherwise use standard rounding
      result = Math.round(x);
    }

    // Convert -0 to +0
    return result === 0 ? 0 : result;
  });
}