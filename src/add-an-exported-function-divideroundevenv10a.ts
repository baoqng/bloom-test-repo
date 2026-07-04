export function divideRoundEvenV10(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const remainder = quotient - floor;

  let result: number;

  // If remainder is exactly 0.5, round to nearest even
  if (Math.abs(remainder - 0.5) < Number.EPSILON) {
    result = floor % 2 === 0 ? floor : floor + 1;
  } else {
    // Otherwise use standard rounding
    result = Math.round(quotient);
  }

  // Normalize -0 to +0
  return result === 0 ? 0 : result;
}