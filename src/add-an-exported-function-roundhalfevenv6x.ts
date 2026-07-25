// bloom-deps:

export function roundHalfEvenV6(x: number): number {
  // Validate input: must be a finite number
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);

  // If x is already an integer, return it
  if (floor === ceil) {
    return floor;
  }

  // Calculate the fractional part
  const fract = x - floor;

  // Check for exact tie (0.5)
  if (fract === 0.5) {
    // Banker's rounding: round to the nearest even number
    // If floor is even, round down (return floor)
    // If floor is odd, round up (return ceil)
    return floor % 2 === 0 ? floor : ceil;
  }

  // Not a tie: round to nearest integer
  // If fractional part < 0.5, round down
  // If fractional part > 0.5, round up
  return fract < 0.5 ? floor : ceil;
}