export function roundHalfEvenV9(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const ceil = Math.ceil(x);

  if (floor === ceil) {
    return floor;
  }

  const fraction = x - floor;

  let result: number;

  if (fraction < 0.5) {
    result = floor;
  } else if (fraction > 0.5) {
    result = ceil;
  } else {
    result = floor % 2 === 0 ? floor : ceil;
  }

  // Avoid returning -0; normalize to +0
  if (result === 0) {
    return 0;
  }

  return result;
}