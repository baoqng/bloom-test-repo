// bloom-deps:

export function roundHalfEvenV3(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const fract = x - floor;

  if (fract === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  }

  return Math.round(x);
}