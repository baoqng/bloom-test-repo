// bloom-deps:

export function divideRoundEvenV22(a: number, b: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numeric');
  }

  if (isNaN(a) || isNaN(b)) {
    throw new TypeError('Arguments must be valid numbers');
  }

  // Division by zero check
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  // Compute the exact quotient
  const quotient = a / b;

  // Get the floor of the quotient
  const floor = Math.floor(quotient);

  // Compute the fractional part
  const fract = quotient - floor;

  // Apply banker's rounding (round half to even)
  if (fract < 0.5) {
    // Round down
    return floor;
  } else if (fract > 0.5) {
    // Round up
    return floor + 1;
  } else {
    // Exact tie at 0.5: round to nearest even
    // If floor is even, round down; if floor is odd, round up
    return floor % 2 === 0 ? floor : floor + 1;
  }
}