// bloom-deps:

export function divideRoundEvenV9(a: number, b: number): number {
  // Type validation - must occur before any arithmetic
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
  
  // Perform the division
  const quotient = a / b;
  
  // Get the integer and fractional parts
  const intPart = Math.trunc(quotient);
  const fracPart = quotient - intPart;
  
  // If the fractional part is exactly 0.5, apply banker's rounding (round to even)
  if (fracPart === 0.5) {
    // Round to the nearest even integer
    return intPart % 2 === 0 ? intPart : intPart + 1;
  }
  
  // If the fractional part is exactly -0.5, apply banker's rounding (round to even)
  if (fracPart === -0.5) {
    // Round to the nearest even integer (toward zero for negative)
    return intPart % 2 === 0 ? intPart : intPart - 1;
  }
  
  // For all other cases, round to the nearest integer using standard rounding
  return Math.round(quotient);
}