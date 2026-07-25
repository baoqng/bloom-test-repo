// bloom-deps:

export function roundHalfEven(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // For non-tie cases, Math.round() gives us the nearest integer
  // For tie cases (x.5 where x is integer), we need banker's rounding
  
  const floor = Math.floor(x);
  const fract = x - floor;
  
  // Not a tie case - use standard rounding
  if (fract !== 0.5 && fract !== -0.5) {
    return Math.round(x);
  }
  
  // Tie case: fract is exactly 0.5 or -0.5
  // Round to nearest even integer
  if (fract === 0.5) {
    // Positive tie: round to nearest even
    // floor is the integer part; floor+1 is the next integer
    // if floor is even, return floor; if floor is odd, return floor+1
    return floor % 2 === 0 ? floor : floor + 1;
  } else {
    // Negative tie (fract === -0.5)
    // floor is already one less than x's integer part
    // e.g., for -2.5: floor = -3, so we want -2 (nearest even)
    // for -1.5: floor = -2, so we want -2 (which is even)
    const ceiling = floor + 1;
    return ceiling % 2 === 0 ? ceiling : floor;
  }
}