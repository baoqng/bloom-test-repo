// bloom-deps:

export function halfEvenRound(x: number): number {
  // Handle special cases
  if (!isFinite(x)) {
    return x;
  }

  // Get the integer part and fractional part
  const floor = Math.floor(x);
  const frac = x - floor;

  // If not halfway, use standard rounding
  if (Math.abs(frac - 0.5) > 1e-10) {
    return Math.round(x);
  }

  // At this point, x is exactly halfway (or very close due to floating point)
  // Round to the nearest even integer
  if (floor % 2 === 0) {
    // floor is even, round down (return floor)
    return floor;
  } else {
    // floor is odd, round up (return floor + 1)
    return floor + 1;
  }
}