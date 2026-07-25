// bloom-deps:

export function roundHalfEvenV4(x: number): number {
  // Type and finite guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // For integers, return as-is
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the integer and fractional parts
  const floor = Math.floor(x);
  const fract = x - floor;

  // Exact tie: fract === 0.5 means x is exactly halfway
  if (fract === 0.5) {
    // Round to nearest even integer
    // If floor is even, round down (return floor); if odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Not a tie: round to nearest integer using standard rounding
  // fract < 0.5 rounds down, fract > 0.5 rounds up
  return fract < 0.5 ? floor : floor + 1;
}