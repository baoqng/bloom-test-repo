// bloom-deps:

export function roundHalfEvenV24(x: number): number {
  // Validate input is a finite number
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);

  // If x is already an integer
  if (floor === ceil) {
    return floor;
  }

  // Get the fractional part
  const fract = x - floor;

  // If fractional part is exactly 0.5 (tie case)
  if (fract === 0.5) {
    // Round to the nearest even integer
    // floor is odd, ceil is even -> return ceil
    // floor is even, ceil is odd -> return floor
    return floor % 2 === 0 ? floor : ceil;
  }

  // For all other cases, round to the nearest integer
  return fract < 0.5 ? floor : ceil;
}