// bloom-deps:

export function roundHalfEvenV19(x: number): number {
  // Validate input: must be a finite number
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Get the integer part and fractional part
  const floor = Math.floor(x);
  const fract = x - floor;

  // Not a tie: use standard rounding (round to nearest)
  if (fract !== 0.5 && fract !== -0.5) {
    return Math.round(x);
  }

  // Tie case: fract === 0.5 or fract === -0.5
  // Round to the nearest even integer (banker's rounding)
  // For positive x: if floor is even, round down; if floor is odd, round up
  // For negative x: floor is already the lower integer, so apply same logic
  if (fract === 0.5) {
    // x is of form n.5 where n is an integer
    // floor is n, we need to round to the nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  } else {
    // fract === -0.5
    // x is of form -n.5 where n is a positive integer
    // floor is -(n+1), we need to round to the nearest even
    return floor % 2 === 0 ? floor : floor - 1;
  }
}