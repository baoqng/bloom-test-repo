// bloom-deps:

export function divideRoundEvenV16(a: number, b: number): number {
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
  
  // If fractional part is exactly 0.5, apply banker's rounding (round to even)
  if (fract === 0.5) {
    // If floor is even, round down (return floor); if odd, round up (return floor + 1)
    return floor % 2 === 0 ? floor : floor + 1;
  }
  
  // For all other cases, round to nearest integer using standard rounding
  return Math.round(quotient);
}