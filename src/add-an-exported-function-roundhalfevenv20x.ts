// bloom-deps:

export function roundHalfEvenV20(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle special cases
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);

  // Calculate the fractional part
  const fract = x - floor;

  // Strict equality check for exact ties (no epsilon tolerance)
  if (fract === 0.5) {
    // Banker's rounding: round to nearest even integer
    // If floor is even, round down; if floor is odd, round up
    return floor % 2 === 0 ? floor : ceil;
  }

  // For non-tie cases, round to nearest integer
  return fract < 0.5 ? floor : ceil;
}