// bloom-deps:

export function divideRoundEvenV3(a: number, b: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('divideRoundEvenV3: both arguments must be numbers');
  }
  
  if (isNaN(a) || isNaN(b)) {
    throw new TypeError('divideRoundEvenV3: both arguments must be valid numbers');
  }

  // Division by zero check
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const fract = quotient - floor;

  // Exact tie: fract === 0.5 (strict equality, no epsilon tolerance)
  if (fract === 0.5) {
    // Round to nearest even integer
    const even = floor % 2 === 0 ? floor : floor + 1;
    return even;
  }

  // Non-tie: use standard nearest rounding
  // fract < 0.5 rounds down (return floor)
  // fract > 0.5 rounds up (return floor + 1)
  if (fract < 0.5) {
    return floor;
  } else {
    return floor + 1;
  }
}