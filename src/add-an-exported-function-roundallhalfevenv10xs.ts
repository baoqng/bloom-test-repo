// bloom-deps:

export function roundAllHalfEvenV10(xs: number[]): number[] {
  for (const x of xs) {
    if (!Number.isFinite(x)) {
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
      // Exactly 0.5 — round to even
      return floor % 2 === 0 ? floor : floor + 1;
    }
  });
}