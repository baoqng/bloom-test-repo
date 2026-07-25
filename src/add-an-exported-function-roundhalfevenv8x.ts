// bloom-deps:

export function roundHalfEvenV8(x: number): number {
  // Type validation: must be a finite number
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

  // Calculate the fractional part
  const fract = x - floor;

  // Exact tie: fract === 0.5
  if (fract === 0.5) {
    // Round to nearest EVEN integer (banker's rounding)
    // If floor is even, round down; if floor is odd, round up
    return floor % 2 === 0 ? floor : ceil;
  }

  // Not a tie: use standard rounding (nearest integer)
  return fract < 0.5 ? floor : ceil;
}