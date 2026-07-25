// bloom-deps:

export function roundHalfEvenV22(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // For integers, return as-is
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fract = x - floor;

  // If exactly halfway (0.5), apply banker's rounding (round to even)
  if (fract === 0.5) {
    // Round to the even number
    return floor % 2 === 0 ? floor : ceil;
  }

  // Otherwise, round to nearest (normal rounding)
  return fract < 0.5 ? floor : ceil;
}