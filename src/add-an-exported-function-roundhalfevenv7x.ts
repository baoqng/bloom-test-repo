// bloom-deps:

export function roundHalfEvenV7(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Get the integer and fractional parts
  const floor = Math.floor(x);
  const fract = x - floor;

  // Not a tie - use standard rounding to nearest
  if (fract !== 0.5 && fract !== -0.5) {
    return Math.round(x);
  }

  // Exact tie case: round to nearest EVEN integer
  // For positive x.5: if floor is even, round down; if floor is odd, round up
  // For negative x.5: if floor is even, use floor; if floor is odd, use floor + 1
  if (floor % 2 === 0) {
    return floor;
  } else {
    return floor + 1;
  }
}