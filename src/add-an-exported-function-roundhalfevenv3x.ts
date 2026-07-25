// bloom-deps:

export function roundHalfEvenV3(x: number): number {
  // Input validation: must be finite
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // For integers, return as-is
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  
  // Calculate the fractional part
  const fract = x - floor;

  // Exact tie case (0.5): round to nearest even
  if (fract === 0.5) {
    // floor is even, return floor; otherwise return ceil
    return floor % 2 === 0 ? floor : ceil;
  }

  // Not a tie: round to nearest integer
  return fract < 0.5 ? floor : ceil;
}