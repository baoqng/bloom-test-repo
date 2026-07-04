// bloom-deps:

export function divideRoundEvenV5(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const fraction = quotient - floor;

  // Non-half fractions: use standard nearest rounding
  if (fraction !== 0.5) {
    return Math.round(quotient) === 0 ? 0 : Math.round(quotient);
  }

  // Exact half: round to nearest even integer
  // floor is the lower integer, floor + 1 is the upper integer
  if (floor % 2 === 0) {
    return floor === 0 ? 0 : floor;
  } else {
    return floor + 1;
  }
}