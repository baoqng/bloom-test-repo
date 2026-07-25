// bloom-deps:

export function roundHalfEvenV3(x: number): number {
  // Type validation: x must be a finite number
  if (typeof x !== 'number' || !isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // For integers, return as-is
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fract = x - floor;

  // Exact tie: round to nearest even
  if (fract === 0.5) {
    // floor is even, return floor; otherwise return ceil
    return floor % 2 === 0 ? floor : ceil;
  }

  // Not a tie: round to nearest integer using standard rounding
  if (fract < 0.5) {
    return floor;
  } else {
    return ceil;
  }
}