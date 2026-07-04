export function divideRoundEvenV7(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floored = Math.floor(quotient);
  const fraction = quotient - floored;

  let result: number;

  // Non-half fractions: standard nearest rounding
  if (fraction < 0.5) {
    result = floored;
  } else if (fraction > 0.5) {
    result = floored + 1;
  } else {
    // Exact half: round to nearest even
    if (floored % 2 === 0) {
      result = floored;
    } else {
      result = floored + 1;
    }
  }

  // Normalize -0 to +0
  return result === 0 ? 0 : result;
}