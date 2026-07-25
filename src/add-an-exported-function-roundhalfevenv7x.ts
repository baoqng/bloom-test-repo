// bloom-deps:

export function roundHalfEvenV7(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle the case where x is already an integer
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);

  // Calculate the fractional part
  const fract = x - floor;

  // Exact tie case: fract === 0.5 (using strict equality, no epsilon tolerance)
  if (fract === 0.5) {
    // Round to nearest even integer (banker's rounding)
    // If floor is even, return floor; if floor is odd, return ceil
    return floor % 2 === 0 ? floor : ceil;
  }

  // Non-tie case: round to nearest integer using standard rounding
  if (fract < 0.5) {
    return floor;
  } else {
    return ceil;
  }
}