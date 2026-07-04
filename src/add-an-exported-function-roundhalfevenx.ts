export function roundHalfEven(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const ceil = Math.ceil(x);

  let result: number;

  if (floor === ceil) {
    result = floor;
  } else {
    const remainder = x - floor;

    if (remainder < 0.5) {
      result = floor;
    } else if (remainder > 0.5) {
      result = ceil;
    } else {
      result = floor % 2 === 0 ? floor : ceil;
    }
  }

  // Normalize -0 to +0
  return result === 0 ? 0 : result;
}