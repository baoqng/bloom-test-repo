// bloom-deps:

export function divideRoundEven(a: number, b: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('divideRoundEven requires numeric arguments');
  }
  
  if (isNaN(a) || isNaN(b)) {
    throw new TypeError('divideRoundEven requires numeric arguments');
  }
  
  // Division by zero check
  if (b === 0) {
    throw new RangeError('division by zero');
  }
  
  // Perform the division
  const result = a / b;
  
  // Get the integer and fractional parts
  const floor = Math.floor(result);
  const fract = result - floor;
  
  // Check if this is an exact tie (fraction === 0.5)
  if (fract === 0.5) {
    // Banker's rounding: round to nearest even
    // floor is the lower integer, floor + 1 is the upper integer
    const lower = floor;
    const upper = floor + 1;
    
    // Return the even one
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  } else if (fract === -0.5) {
    // For negative results, fract is -0.5
    // floor is already the lower value (more negative)
    // floor + 1 is the higher value (less negative)
    const lower = floor;
    const upper = floor + 1;
    
    // Return the even one
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  } else {
    // Not a tie - use standard rounding to nearest
    return Math.round(result);
  }
}