export function roundHalfEvenV10(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const ceil = Math.ceil(x);

  if (floor === ceil) {
    return floor === 0 ? 0 : floor;
  }

  const fraction = x - floor;

  if (fraction < 0.5) {
    return floor === 0 ? 0 : floor;
  }

  if (fraction > 0.5) {
    return ceil === 0 ? 0 : ceil;
  }

  // fraction === 0.5: round to nearest even
  const result = floor % 2 === 0 ? floor : ceil;
  return result === 0 ? 0 : result;
}