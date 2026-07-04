// bloom-deps:

export function roundHalfEven(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const diff = x - floor;

  if (diff < 0.5) {
    return floor;
  } else if (diff > 0.5) {
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