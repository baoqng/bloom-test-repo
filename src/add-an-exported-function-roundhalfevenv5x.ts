export function roundHalfEvenV5(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const ceil = Math.ceil(x);

  if (floor === ceil) {
    return floor === 0 ? 0 : floor;
  }

  const remainder = x - floor;

  if (remainder < 0.5) {
    return floor === 0 ? 0 : floor;
  }

  if (remainder > 0.5) {
    return ceil === 0 ? 0 : ceil;
  }

  // remainder === 0.5, use banker's rounding (round to even)
  const result = floor % 2 === 0 ? floor : ceil;
  return result === 0 ? 0 : result;
}