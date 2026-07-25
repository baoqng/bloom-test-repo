// bloom-deps:

export function roundHalfEvenV12(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle integer case
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = floor + 1;

  // Calculate fractional part
  const fract = x - floor;

  // Use strict equality for tie detection (no epsilon tolerance)
  if (fract === 0.5) {
    // Banker's rounding: round to even
    // If floor is even, round down; if floor is odd, round up (to make ceil even)
    return floor % 2 === 0 ? floor : ceil;
  }

  // For non-tie cases, round to nearest
  return fract < 0.5 ? floor : ceil;
}