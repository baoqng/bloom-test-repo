// bloom-deps:

export function roundHalfEvenV5(x: number): number {
  // Type validation guard — must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  const floor = Math.floor(x);
  const fract = x - floor;

  // Exact tie: fract === 0.5 (banker's rounding to nearest even)
  if (fract === 0.5) {
    // Round to nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Not a tie: round to nearest using standard rounding
  if (fract < 0.5) {
    return floor;
  }

  return floor + 1;
}