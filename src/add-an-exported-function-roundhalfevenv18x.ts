// bloom-deps:

export function roundHalfEvenV18(x: number): number {
  // Type validation guard: must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle integers and values very close to integers
  const floor = Math.floor(x);
  const fract = x - floor;

  // Not a tie: round to nearest integer using standard rounding
  if (fract !== 0.5 && fract !== -0.5) {
    return Math.round(x);
  }

  // Tie case: fract === 0.5 or fract === -0.5
  // Round to the nearest EVEN integer
  // For positive x: if floor is even, round down; if floor is odd, round up
  // For negative x: same logic applies due to how floor works
  if (floor % 2 === 0) {
    return floor;
  }
  return floor + 1;
}