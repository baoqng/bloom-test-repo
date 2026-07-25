// bloom-deps:

export function roundAllHalfEvenV5(xs: number[]): number[] {
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  return xs.map((x) => {
    const floor = Math.floor(x);
    const fract = x - floor;

    if (fract === 0.5) {
      // Round to even
      if (floor % 2 === 0) {
        return floor;
      } else {
        return floor + 1;
      }
    } else {
      return Math.round(x);
    }
  });
}