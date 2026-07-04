// bloom-deps:

export function roundAllHalfEven(xs: number[]): number[] {
  for (let i = 0; i < xs.length; i++) {
    const val = xs[i];
    if (typeof val !== 'number' || !isFinite(val)) {
      throw new RangeError('all elements must be finite');
    }
  }

  return xs.map((val) => {
    const floor = Math.floor(val);
    const frac = val - floor;

    if (frac < 0.5) {
      return floor;
    } else if (frac > 0.5) {
      return floor + 1;
    } else {
      // exactly 0.5 — round to nearest even
      if (floor % 2 === 0) {
        return floor;
      } else {
        return floor + 1;
      }
    }
  });
}