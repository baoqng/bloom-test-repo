// bloom-deps:

export function divideRoundEvenV4(a: number, b: number): number {
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

  const rounded = Math.round(quotient);
  // Ensure positive zero is returned instead of negative zero
  return rounded === 0 ? 0 : rounded;
}