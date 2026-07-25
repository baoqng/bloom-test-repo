// bloom-deps:

export function roundAllHalfEvenV4(xs: number[]): number[] {
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
      // Banker's rounding: round to nearest even integer
      const floorIsEven = floor % 2 === 0;
      return floorIsEven ? floor : floor + 1;
    } else {
      return Math.round(x);
    }
  });
}