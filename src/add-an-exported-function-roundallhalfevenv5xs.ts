// bloom-deps:

export function roundAllHalfEvenV5(xs: number[]): number[] {
  for (let i = 0; i < xs.length; i++) {
    const el = xs[i];
    if (typeof el !== 'number' || !Number.isFinite(el)) {
      throw new RangeError('all elements must be finite');
    }
  }

  return xs.map((x) => {
    const floor = Math.floor(x);
    const fraction = x - floor;

    if (fraction < 0.5) {
      return floor;
    } else if (fraction > 0.5) {
      return floor + 1;
    } else {
      // Exactly 0.5 — round to nearest even
      if (floor % 2 === 0) {
        return floor;
      } else {
        return floor + 1;
      }
    }
  });
}