// bloom-deps:

export function roundHalfEven(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const fraction = x - floor;

  if (fraction < 0.5) {
    return floor;
  }

  if (fraction > 0.5) {
    return floor + 1;
  }

  // fraction === 0.5 (exact half)
  // Round to nearest even integer
  if (floor % 2 === 0) {
    return floor;
  } else {
    return floor + 1;
  }
}