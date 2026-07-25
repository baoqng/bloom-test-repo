// bloom-deps:

export function roundHalfEven(x: number): number {
  // Type validation: must be a finite number
  if (typeof x !== 'number' || !isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // For integers, return as-is
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the integer and fractional parts
  const floor = Math.floor(x);
  const fract = x - floor;

  // Check for exact tie (0.5)
  if (fract === 0.5) {
    // Round to nearest even integer
    // If floor is even, return floor; if odd, return floor + 1
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For non-tie cases, round to nearest integer
  // fract < 0.5: round down (return floor)
  // fract > 0.5: round up (return floor + 1)
  return fract < 0.5 ? floor : floor + 1;
}