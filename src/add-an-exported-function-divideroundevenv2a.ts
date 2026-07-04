// bloom-deps:

export function divideRoundEvenV2(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const fraction = quotient - floor;

  if (fraction === 0.5) {
    // Exact half: round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  }

  return Math.round(quotient);
}