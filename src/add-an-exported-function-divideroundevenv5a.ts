// bloom-deps:

export function divideRoundEvenV5(a: number, b: number): number {
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
  
  // Get the integer part and fractional part
  const floor = Math.floor(quotient);
  const fract = quotient - floor;
  
  // If fractional part is exactly 0.5 (tie), apply banker's rounding (half_even)
  if (fract === 0.5) {
    // Round to the nearest even integer
    // If floor is even, round down; if floor is odd, round up
    return floor % 2 === 0 ? floor : floor + 1;
  }
  
  // Otherwise, round to nearest using standard rounding
  return Math.round(quotient);
}