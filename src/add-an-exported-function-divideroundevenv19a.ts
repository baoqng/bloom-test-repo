// bloom-deps:

export function divideRoundEvenV19(a: number, b: number): number {
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
  
  // Get the integer part and fractional part
  const integerPart = Math.floor(quotient);
  const fractionalPart = quotient - integerPart;
  
  // Handle exact ties (0.5) using banker's rounding (round to even)
  if (fractionalPart === 0.5) {
    // Round to the nearest even integer
    return integerPart % 2 === 0 ? integerPart : integerPart + 1;
  }
  
  // For non-tie values, use standard rounding (round to nearest)
  if (fractionalPart >= 0.5) {
    return integerPart + 1;
  }
  
  return integerPart;
}