// bloom-deps:

export function divideRoundEvenV7(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const fraction = quotient - floor;

  // If fraction is less than 0.5, round down
  if (fraction < 0.5) {
    return floor;
  }

  // If fraction is greater than 0.5, round up
  if (fraction > 0.5) {
    return floor + 1;
  }

  // Fraction is exactly 0.5 - use banker's rounding (round to even)
  const roundedDown = floor;
  const roundedUp = floor + 1;

  // Return the even number
  return roundedDown % 2 === 0 ? roundedDown : roundedUp;
}