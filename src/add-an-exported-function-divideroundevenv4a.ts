export function divideRoundEvenV4(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;

  // Handle special case: -0 should be +0
  if (quotient === 0) {
    return 0;
  }

  const floored = Math.floor(quotient);
  const diff = quotient - floored;

  if (diff < 0.5) {
    return floored;
  } else if (diff > 0.5) {
    return floored + 1;
  } else {
    // Exact half: round to nearest even
    if (floored % 2 === 0) {
      return floored;
    } else {
      return floored + 1;
    }
  }
}