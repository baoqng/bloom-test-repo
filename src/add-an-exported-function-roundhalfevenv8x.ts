// bloom-deps:

export function roundHalfEvenV8(x: number): number {
  // Type validation: must be numeric and finite
  if (typeof x !== 'number' || !isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Handle zero case
  if (x === 0) {
    return 0;
  }

  // Get the integer and fractional parts
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const floor = Math.floor(absX);
  const fract = absX - floor;

  // If no fractional part, return as-is
  if (fract === 0) {
    return x;
  }

  // If fractional part is less than 0.5, round down (toward zero)
  if (fract < 0.5) {
    return sign * floor;
  }

  // If fractional part is greater than 0.5, round up (away from zero)
  if (fract > 0.5) {
    return sign * (floor + 1);
  }

  // Fractional part is exactly 0.5 (banker's rounding: round to even)
  // Check if the integer part is even
  if (floor % 2 === 0) {
    // Even: round down (keep the even number)
    return sign * floor;
  } else {
    // Odd: round up (to the next even number)
    return sign * (floor + 1);
  }
}