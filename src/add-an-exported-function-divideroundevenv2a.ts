// bloom-deps:

export function divideRoundEvenV2(a: number, b: number): number {
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
  
  // Check if already an integer
  if (Number.isInteger(quotient)) {
    return quotient;
  }
  
  // Get the floor and check the fractional part
  const floor = Math.floor(quotient);
  const fract = quotient - floor;
  
  // Exact tie: round to nearest even
  if (fract === 0.5) {
    // floor is the lower integer, floor + 1 is the upper integer
    // Round to whichever is even
    return floor % 2 === 0 ? floor : floor + 1;
  }
  
  // Not a tie: use standard rounding (nearest)
  // fract < 0.5: round down (return floor)
  // fract > 0.5: round up (return floor + 1)
  return fract < 0.5 ? floor : floor + 1;
}