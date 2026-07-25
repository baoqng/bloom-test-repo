// bloom-deps:

export function divideRoundEvenV12(a: number, b: number): number {
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

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const fract = quotient - floor;

  // Exact tie detection using strict equality (no epsilon tolerance)
  if (fract === 0.5) {
    // Banker's rounding (half-even): round to nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Not a tie: use standard rounding
  return Math.round(quotient);
}