export function divideRoundEvenV4(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const ceil = Math.ceil(quotient);
  const remainder = quotient - floor;

  let result: number;

  // If exactly halfway between two integers, round to the even one
  if (remainder === 0.5) {
    result = floor % 2 === 0 ? floor : ceil;
  } else {
    // Otherwise, use standard rounding
    result = Math.round(quotient);
  }

  // Convert -0 to +0
  return result === 0 ? 0 : result;
}