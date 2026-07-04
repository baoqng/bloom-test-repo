export function divideRoundEvenV3(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  
  // Handle special case: if quotient is -0, return +0
  if (quotient === 0) {
    return 0;
  }

  const floored = Math.floor(quotient);
  const fraction = quotient - floored;

  if (fraction < 0.5) {
    return floored;
  } else if (fraction > 0.5) {
    return floored + 1;
  } else {
    // Exact half: round to even
    if (floored % 2 === 0) {
      return floored;
    } else {
      return floored + 1;
    }
  }
}