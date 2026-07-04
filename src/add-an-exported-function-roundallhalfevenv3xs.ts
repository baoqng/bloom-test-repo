export function roundAllHalfEvenV3(xs: number[]): number[] {
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  return xs.map((x) => {
    // Handle -0 case
    if (Object.is(x, -0)) {
      return 0;
    }

    const floor = Math.floor(x);
    const fraction = x - floor;

    let result;
    if (fraction < 0.5) {
      result = floor;
    } else if (fraction > 0.5) {
      result = floor + 1;
    } else {
      // exactly 0.5 — round to nearest even
      result = floor % 2 === 0 ? floor : floor + 1;
    }

    // Normalize -0 to 0
    return Object.is(result, -0) ? 0 : result;
  });
}