// bloom-deps:

export function roundHalfEvenV16(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // For integers, return as-is
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = floor + 1;

  // Calculate the fractional part
  const fract = x - floor;

  // If not exactly halfway between two integers, round to nearest
  if (fract !== 0.5) {
    return Math.round(x);
  }

  // Exactly halfway (fract === 0.5): round to even (banker's rounding)
  // floor is even if floor % 2 === 0
  if (floor % 2 === 0) {
    return floor;
  } else {
    return ceil;
  }
}