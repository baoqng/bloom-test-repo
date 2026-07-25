// bloom-deps:

export function divideRoundEvenV6(a: number, b: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('divideRoundEvenV6: both arguments must be numbers');
  }

  if (isNaN(a) || isNaN(b)) {
    throw new TypeError('divideRoundEvenV6: arguments must be valid numbers');
  }

  // Division by zero check
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;

  // If quotient is already an integer, return it
  if (Number.isInteger(quotient)) {
    return quotient;
  }

  const floor = Math.floor(quotient);
  const fract = quotient - floor;

  // Check for exact tie (fract === 0.5)
  if (fract === 0.5) {
    // Round to nearest EVEN integer
    // If floor is even, return floor; if floor is odd, return floor + 1
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Standard rounding: round to nearest
  // If fract < 0.5, round down (floor); if fract > 0.5, round up (floor + 1)
  return fract < 0.5 ? floor : floor + 1;
}