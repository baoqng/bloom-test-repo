// bloom-deps:

export function roundHalfEven(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('all elements must be finite');
  }
  const floor = Math.floor(x);
  const fraction = x - floor;
  if (fraction < 0.5) return floor;
  if (fraction > 0.5) return floor + 1;
  // exactly 0.5 — round to nearest even
  return floor % 2 === 0 ? floor : floor + 1;
}

export function roundAllHalfEven(xs: number[]): number[] {
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }
  return xs.map(x => roundHalfEven(x));
}