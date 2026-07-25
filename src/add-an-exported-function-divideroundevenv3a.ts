// bloom-deps:

export function divideRoundEvenV3(a: number, b: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
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
  const integer = Math.trunc(quotient);
  const fractional = quotient - integer;
  
  // Handle exact halves (use strict equality, no epsilon tolerance)
  if (fractional === 0.5) {
    // Round to nearest even integer
    return integer % 2 === 0 ? integer : integer + 1;
  } else if (fractional === -0.5) {
    // For negative halves, round to nearest even
    return integer % 2 === 0 ? integer : integer - 1;
  }
  
  // For non-half fractions, use standard rounding
  return Math.round(quotient);
}