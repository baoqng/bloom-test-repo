// bloom-deps:

export function roundHalfEvenV6(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Extract the integer and fractional parts
  const floor = Math.floor(x);
  const fract = x - floor;

  // Not a tie - round to nearest using standard rules
  if (fract !== 0.5 && fract !== -0.5) {
    return Math.round(x);
  }

  // Exact tie: fract === 0.5 or fract === -0.5
  // Round to the nearest EVEN integer (banker's rounding)
  // For positive ties: if floor is even, round down; if odd, round up
  // For negative ties: if floor is even, round down; if odd, round up
  if (fract === 0.5) {
    // x = floor + 0.5, so next integer is floor + 1
    // Round to whichever is even
    return floor % 2 === 0 ? floor : floor + 1;
  } else {
    // fract === -0.5
    // x = floor - 0.5, so floor is already the "upper" integer
    // Round to whichever is even
    return floor % 2 === 0 ? floor : floor - 1;
  }
}