// bloom-deps:

export function roundHalfEvenV11(x: number): number {
  if (typeof x !== "number" || !Number.isFinite(x)) {
    throw new RangeError("x must be finite");
  }

  const floor = Math.floor(x);
  const fract = x - floor;

  if (fract < 0.5) {
    return floor;
  }

  if (fract > 0.5) {
    return floor + 1;
  }

  if (fract === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  }

  return floor;
}