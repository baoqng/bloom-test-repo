export function divideRoundEvenV5(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const remainder = quotient - floor;

  let result: number;

  // If remainder is less than 0.5, round down
  if (remainder < 0.5) {
    result = floor;
  }
  // If remainder is greater than 0.5, round up
  else if (remainder > 0.5) {
    result = floor + 1;
  }
  // Remainder is exactly 0.5: round to nearest even
  // If floor is even, return floor; otherwise return floor + 1
  else {
    result = floor % 2 === 0 ? floor : floor + 1;
  }

  // Convert -0 to +0
  return result === 0 ? 0 : result;
}