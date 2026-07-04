// bloom-deps:

export function roundHalfEven(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('all elements must be finite');
  }
  const floor = Math.floor(x);
  const fraction = x - floor;
  if (fraction === 0.5) {
    // Round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  }
  const rounded = Math.round(x);
  // Handle -0 case: Math.round(-0.4) returns -0, but we want +0
  return rounded === 0 ? 0 : rounded;
}

export function roundAllHalfEvenV2(xs: number[]): number[] {
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }
  return xs.map(x => roundHalfEven(x));
}