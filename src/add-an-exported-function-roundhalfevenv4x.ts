// bloom-deps:

export function roundHalfEvenV4(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle exact integer case
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the integer and fractional parts
  const floor = Math.floor(x);
  const fract = x - floor;

  // Check for exact tie (0.5 case using strict equality)
  if (fract === 0.5) {
    // Banker's rounding: round to nearest even integer
    // If floor is even, return floor; if odd, return floor + 1
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Non-tie case: round to nearest integer using standard rounding
  if (fract < 0.5) {
    return floor;
  } else {
    return floor + 1;
  }
}