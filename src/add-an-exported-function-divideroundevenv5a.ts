export function divideRoundEvenV5(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const quotient = a / b;
  const floor = Math.floor(quotient);
  const diff = quotient - floor;

  let result: number;

  if (diff < 0.5) {
    result = floor;
  } else if (diff > 0.5) {
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
  if (result === 0) {
    return 0;
  }

  return result;
}