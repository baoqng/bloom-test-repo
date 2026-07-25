// bloom-deps:

export function roundHalfEvenV25(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle the case where x is already an integer
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);

  // Calculate the fractional part
  const fract = x - floor;

  // If fract is exactly 0.5 (tie), use banker's rounding (round to even)
  if (fract === 0.5) {
    // Round to the even integer
    return floor % 2 === 0 ? floor : ceil;
  }

  // For non-tie cases, round to nearest
  return fract < 0.5 ? floor : ceil;
}