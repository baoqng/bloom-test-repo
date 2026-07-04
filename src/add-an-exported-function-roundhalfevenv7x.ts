export function roundHalfEvenV7(x: number): number {
  if (!Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const frac = x - floor;

  let result: number;

  if (frac < 0.5) {
    result = floor;
  } else if (frac > 0.5) {
    result = floor + 1;
  } else if (frac === 0.5) {
    result = floor % 2 === 0 ? floor : floor + 1;
  } else {
    result = floor;
  }

  // Normalize -0 to +0
  return result === 0 ? 0 : result;
}