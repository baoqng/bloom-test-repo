// bloom-deps:

export function roundHalfEven(x: number): number {
  // Validate input type and finiteness
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Get the integer part and fractional part
  const floor = Math.floor(x);
  const fract = x - floor;

  // If fractional part is 0, already an integer
  if (fract === 0) {
    return floor;
  }

  // If fractional part is exactly 0.5 (tie case), round to even
  if (fract === 0.5) {
    // floor is even, round down (return floor)
    if (floor % 2 === 0) {
      return floor;
    }
    // floor is odd, round up (return floor + 1)
    return floor + 1;
  }

  // If fractional part is less than 0.5, round down
  if (fract < 0.5) {
    return floor;
  }

  // If fractional part is greater than 0.5, round up
  return floor + 1;
}