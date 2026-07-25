// bloom-deps:

export function roundAllHalfEvenV7(xs: number[]): number[] {
  // Input validation: check all elements are finite numbers
  for (const x of xs) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Process each element with round-half-to-even
  return xs.map((x) => {
    const floor = Math.floor(x);
    const fract = x - floor;

    // Exact tie: 0.5 away from nearest integer
    if (fract === 0.5) {
      // Round to nearest even integer
      return floor % 2 === 0 ? floor : floor + 1;
    }

    // Non-tie: use standard rounding (nearest)
    return Math.round(x);
  });
}