// bloom-deps:

export function divideRoundEvenV3(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const remainder = quotient - floor;

  // If remainder is exactly 0.5, round to nearest even
  if (Math.abs(remainder - 0.5) < Number.EPSILON) {
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // Otherwise, round to nearest integer
  return Math.round(quotient);
}