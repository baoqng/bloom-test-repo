export function divideRoundEven(a: number, b: number): number {
  if (b === 0) {
    throw new RangeError('division by zero');
  }

  const result = a / b;

  // Handle special case: convert -0 to +0
  if (result === 0) {
    return 0;
  }

  const floor = Math.floor(result);
  const fraction = result - floor;

  // If fraction is not exactly 0.5, use normal rounding
  if (Math.abs(fraction - 0.5) > 1e-10) {
    return Math.round(result);
  }

  // Exact half: round to even
  if (floor % 2 === 0) {
    return floor;
  } else {
    return floor + 1;
  }
}