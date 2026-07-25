// bloom-deps:

export function roundHalfEvenV9(x: number): number {
  // Validate input: must be a finite number
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Get the integer part and fractional part
  const floor = Math.floor(x);
  const fract = x - floor;

  // If not a tie (exactly 0.5), round to nearest
  if (fract !== 0.5 && fract !== -0.5) {
    return Math.round(x);
  }

  // Handle tie case: fract === 0.5 or fract === -0.5
  // For positive x: if floor is even, round down (return floor); if odd, round up (return floor + 1)
  // For negative x: floor is already the lower integer, apply same even/odd logic
  if (fract === 0.5) {
    // x is positive and exactly halfway
    return floor % 2 === 0 ? floor : floor + 1;
  } else {
    // fract === -0.5, x is negative and exactly halfway
    // floor is the lower integer (more negative), floor + 1 is closer to zero
    return (floor + 1) % 2 === 0 ? floor + 1 : floor;
  }
}