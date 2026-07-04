export function divideRoundEvenV6(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;

  // Handle special cases: NaN, Infinity
  if (!isFinite(quotient) || isNaN(quotient)) {
    return quotient;
  }

  const floor = Math.floor(quotient);
  const fraction = quotient - floor;

  let result: number;

  if (fraction < 0.5) {
    result = floor;
  } else if (fraction > 0.5) {
    result = floor + 1;
  } else {
    // Exact half: round to nearest even
    if (floor % 2 === 0) {
      result = floor;
    } else {
      result = floor + 1;
    }
  }

  // Normalize -0 to +0
  return result === 0 ? 0 : result;
}