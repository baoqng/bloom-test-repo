export function roundHalfEven(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const ceil = Math.ceil(x);

  if (floor === ceil) {
    return floor;
  }

  const remainder = x - floor;

  if (remainder < 0.5) {
    return floor;
  }

  if (remainder > 0.5) {
    return ceil;
  }

  const result = floor % 2 === 0 ? floor : ceil;
  // Avoid returning -0 when the mathematical result is 0
  return result === 0 ? 0 : result;
}