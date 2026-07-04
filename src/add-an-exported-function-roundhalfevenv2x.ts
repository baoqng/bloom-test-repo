export function roundHalfEvenV2(x: number): number {
  // Validate that x is a finite number
  if (typeof x !== 'number' || !isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle negative zero
  if (Object.is(x, -0)) {
    return 0;
  }

  // Get the integer part and fractional part
  const floor = Math.floor(x);
  const frac = x - floor;

  // If not exactly halfway, use standard rounding
  if (Math.abs(frac - 0.5) > 1e-10) {
    return Math.round(x);
  }

  // x is exactly halfway between two integers
  // Round to the nearest even integer
  if (floor % 2 === 0) {
    // floor is even, round down to floor
    return floor;
  } else {
    // floor is odd, round up to floor + 1
    return floor + 1;
  }
}