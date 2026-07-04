// bloom-deps:

export function divideRoundEvenV6(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const fraction = quotient - floor;

  // If fraction is exactly 0.5, round to even
  if (Math.abs(fraction - 0.5) < Number.EPSILON) {
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Otherwise, use standard rounding
  return Math.round(quotient);
}