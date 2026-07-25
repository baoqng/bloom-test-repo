// bloom-deps:

export function roundAllHalfEvenV5(xs: number[]): number[] {
  // Input validation: check all elements are finite
  for (const x of xs) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element using round-half-to-even
  return xs.map((x) => {
    const floor = Math.floor(x);
    const fract = x - floor;

    // Exact tie at 0.5: round to nearest even
    if (fract === 0.5) {
      return floor % 2 === 0 ? floor : floor + 1;
    }

    // Exact tie at -0.5: round to nearest even
    if (fract === -0.5) {
      return floor % 2 === 0 ? floor : floor - 1;
    }

    // Not a tie: use standard rounding (nearest integer)
    return Math.round(x);
  });
}