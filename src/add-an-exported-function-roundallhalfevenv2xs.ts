export function roundAllHalfEvenV2(xs: number[]): number[] {
  // Validate that all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Create a new array with banker's rounding applied to each element
  return xs.map((x) => {
    // Banker's rounding (round-half-to-even)
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    const frac = x - floor;

    let result: number;

    // If frac < 0.5, round down
    if (frac < 0.5) {
      result = floor;
    }
    // If frac > 0.5, round up
    else if (frac > 0.5) {
      result = ceil;
    }
    // If frac === 0.5, round to the nearest even integer
    // floor is even: return floor; otherwise return ceil
    else {
      result = floor % 2 === 0 ? floor : ceil;
    }

    // Normalize -0 to +0
    return result === 0 ? 0 : result;
  });
}