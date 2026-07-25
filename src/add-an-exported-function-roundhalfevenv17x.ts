// bloom-deps:

export function roundHalfEvenV17(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle the case where x is already an integer
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the floor and ceiling values
  const floor = Math.floor(x);
  const ceil = floor + 1;

  // Calculate the fractional part
  const fract = x - floor;

  // Strict equality check for exact tie (0.5)
  // No epsilon tolerance - use plain equality per contract
  if (fract === 0.5) {
    // Banker's rounding: round to the nearest even integer
    // If floor is even, round down to floor; if floor is odd, round up to ceil
    return floor % 2 === 0 ? floor : ceil;
  }

  // For non-tie cases, round to nearest
  if (fract < 0.5) {
    return floor;
  } else {
    return ceil;
  }
}