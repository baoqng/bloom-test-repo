// bloom-deps:

export function roundAllHalfEvenV3(xs: number[]): number[] {
  // Type validation: check all elements are finite numbers
  for (let i = 0; i < xs.length; i++) {
    const el = xs[i];
    if (typeof el !== 'number' || !Number.isFinite(el)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Round each element using banker's rounding (round half to even)
  return xs.map((x) => {
    const floor = Math.floor(x);
    const fract = x - floor;

    // Exact tie at 0.5 (using strict equality, not epsilon tolerance)
    if (fract === 0.5) {
      // Round to nearest even integer
      // If floor is even, round down; if odd, round up
      return floor % 2 === 0 ? floor : floor + 1;
    }

    // For negative numbers with fractional part -0.5
    if (fract === -0.5) {
      // x is actually Math.floor(x) - 0.5, so we need ceil behavior
      // Ceiling of x
      const ceil = Math.ceil(x);
      // If ceil is even, round to ceil; if odd, round to floor
      return ceil % 2 === 0 ? ceil : floor;
    }

    // Not a tie: use standard rounding (round to nearest)
    return Math.round(x);
  });
}