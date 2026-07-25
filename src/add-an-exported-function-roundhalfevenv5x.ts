// bloom-deps:

export function roundHalfEvenV5(x: number): number {
  // Type validation: must be a finite number
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle exact integers
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the integer and fractional parts
  const floor = Math.floor(x);
  const fract = x - floor;

  // Check for exact half (tie): fract === 0.5
  // Use strict equality per the contract (no epsilon heuristic)
  if (fract === 0.5) {
    // Round to nearest even integer (banker's rounding)
    // If floor is even, round down (return floor)
    // If floor is odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For non-half values, round to nearest (standard rounding)
  if (fract < 0.5) {
    return floor;
  } else {
    return floor + 1;
  }
}