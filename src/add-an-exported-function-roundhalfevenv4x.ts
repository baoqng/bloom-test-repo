// bloom-deps:

export function roundHalfEvenV4(x: number): number {
  // Type validation: must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle integer case
  if (Number.isInteger(x)) {
    return x;
  }

  // Get floor and ceiling
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fract = x - floor;

  // Exact tie case: use banker's rounding (round to even)
  if (fract === 0.5) {
    // Round to the nearest even integer
    return floor % 2 === 0 ? floor : ceil;
  }

  // Non-tie case: round to nearest
  return fract < 0.5 ? floor : ceil;
}