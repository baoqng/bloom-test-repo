// bloom-deps:

export function roundHalfEvenV6(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const diff = x - floor;

  if (diff < 0.5) {
    return floor === 0 ? 0 : floor;
  } else if (diff > 0.5) {
    return floor + 1;
  } else {
    // Exact half: round to nearest even
    if (floor % 2 === 0) {
      return floor === 0 ? 0 : floor;
    } else {
      return floor + 1;
    }
  }
}