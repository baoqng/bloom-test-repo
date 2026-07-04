// bloom-deps:

export function divideRoundEvenV11(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const remainder = quotient - floor;

  // If remainder is less than 0.5, round down
  if (remainder < 0.5) {
    return floor;
  }

  // If remainder is greater than 0.5, round up
  if (remainder > 0.5) {
    return floor + 1;
  }

  // Remainder is exactly 0.5 (banker's rounding to nearest even)
  const isEven = floor % 2 === 0;
  return isEven ? floor : floor + 1;
}