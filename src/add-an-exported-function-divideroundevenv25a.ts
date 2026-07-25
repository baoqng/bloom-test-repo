// bloom-deps:

export function divideRoundEvenV25(a: number, b: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }
  
  // Check for division by zero
  if (b === 0) {
    throw new RangeError('division by zero');
  }
  
  // Perform the division
  const result = a / b;
  
  // Get the integer and fractional parts
  const integer = Math.floor(result);
  const fract = result - integer;
  
  // Handle exact ties (banker's rounding / round half to even)
  if (fract === 0.5) {
    // Round to the nearest even integer
    return integer % 2 === 0 ? integer : integer + 1;
  }
  
  // Handle negative exact ties
  if (fract === -0.5) {
    // For negative numbers, round to the nearest even integer
    return integer % 2 === 0 ? integer : integer - 1;
  }
  
  // Standard rounding for non-tie cases
  return Math.round(result);
}