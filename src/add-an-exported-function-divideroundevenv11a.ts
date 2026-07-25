// bloom-deps:

export function divideRoundEvenV11(a: number, b: number): number {
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
  const floor = Math.floor(quotient);
  const fract = quotient - floor;
  
  // Apply banker's rounding (half-even)
  // If exactly at 0.5, round to nearest even integer
  if (fract === 0.5) {
    // Round to the nearest even number
    return floor % 2 === 0 ? floor : floor + 1;
  }
  
  // For all other cases, use standard rounding (nearest integer)
  return Math.round(quotient);
}