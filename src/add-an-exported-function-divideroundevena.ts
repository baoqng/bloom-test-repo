// bloom-deps:

export function divideRoundEven(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const remainder = quotient - floor;

  // If the remainder is exactly 0.5 (exact half), round to nearest even
  if (Math.abs(remainder - 0.5) < 1e-10) {
    // Round to nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For non-half fractions, use standard rounding (round to nearest)
  const rounded = Math.round(quotient);
  // Ensure +0 for results that round to 0
  return rounded === 0 ? 0 : rounded;
}