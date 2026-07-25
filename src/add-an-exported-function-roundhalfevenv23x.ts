// bloom-deps:

export function roundHalfEvenV23(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle integers and near-integers
  const floor = Math.floor(x);
  const fract = x - floor;

  // No rounding needed
  if (fract === 0) {
    return floor;
  }

  // Strict equality check for exact tie (0.5)
  if (fract === 0.5) {
    // Banker's rounding: round to even
    // floor is even, round down (return floor)
    // floor is odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Not a tie - use standard rounding
  if (fract < 0.5) {
    return floor;
  } else {
    return floor + 1;
  }
}