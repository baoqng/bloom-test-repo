export function roundHalfEvenV6(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const ceil = Math.ceil(x);

  if (floor === ceil) {
    return floor;
  }

  const remainder = x - floor;

  let result: number;

  if (remainder < 0.5) {
    result = floor;
  } else if (remainder > 0.5) {
    result = ceil;
  } else {
    // remainder === 0.5, use banker's rounding (round to even)
    result = floor % 2 === 0 ? floor : ceil;
  }

  // Avoid returning -0; normalize to +0
  if (result === 0) {
    return 0;
  }

  return result;
}