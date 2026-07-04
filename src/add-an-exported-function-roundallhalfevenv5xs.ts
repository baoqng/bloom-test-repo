export function roundAllHalfEvenV5(xs: number[]): number[] {
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  return xs.map((x) => {
    // Normalize negative zero to positive zero
    if (x === 0) return 0;

    const floor = Math.floor(x);
    const frac = x - floor;

    let result: number;
    if (frac < 0.5) {
      result = floor;
    } else if (frac > 0.5) {
      result = floor + 1;
    } else {
      // exactly 0.5 — round to nearest even
      result = floor % 2 === 0 ? floor : floor + 1;
    }

    // Normalize negative zero to positive zero
    return result === 0 ? 0 : result;
  });
}