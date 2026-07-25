// bloom-deps:

export function roundHalfEvenV8(x: number): number {
  // Validate input type and finiteness
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle integer case
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = floor + 1;
  
  // Calculate the fractional part
  const fract = x - floor;
  
  // Exact tie at 0.5 — round to even
  if (fract === 0.5) {
    // floor is even, round down
    if (floor % 2 === 0) {
      return floor;
    }
    // floor is odd, round up to the even ceiling
    return ceil;
  }
  
  // Not a tie — round to nearest
  if (fract < 0.5) {
    return floor;
  }
  
  return ceil;
}