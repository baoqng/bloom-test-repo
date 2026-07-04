// bloom-deps:

export function roundHalfEvenV4(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const fraction = x - floor;

  if (fraction < 0.5) {
    return floor;
  } else if (fraction > 0.5) {
    return floor + 1;
  } else {
    // Exact half: round to nearest even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  }
}