// bloom-deps:

export function divideRoundEvenV18(a: number, b: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }

  if (isNaN(a) || isNaN(b)) {
    throw new TypeError('Arguments must be valid numbers');
  }

  // Division by zero check
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  // Perform division
  const quotient = a / b;

  // Get the integer and fractional parts
  const floor = Math.floor(quotient);
  const fract = quotient - floor;

  // Apply banker's rounding (round half to even)
  if (fract === 0.5) {
    // Exact tie: round to nearest even integer
    // If floor is even, round down (return floor)
    // If floor is odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  } else if (fract > 0.5) {
    // Round up
    return floor + 1;
  } else {
    // Round down (fract < 0.5)
    return floor;
  }
}