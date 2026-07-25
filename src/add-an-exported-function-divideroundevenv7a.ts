// bloom-deps:

import { existsSync } from "fs";

export function divideRoundEvenV7(a: number, b: number): number {
  if (typeof a !== "number" || typeof b !== "number" || isNaN(a) || isNaN(b)) {
    throw new TypeError("Both arguments must be valid numbers");
  }

  if (b === 0) {
    throw new RangeError("division by zero");
  }

  const quotient = a / b;

  if (!isFinite(quotient)) {
    throw new RangeError("division by zero");
  }

  const floor = Math.floor(quotient);
  const fract = quotient - floor;

  if (fract === 0.5) {
    // Banker's rounding: round to even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  }

  return Math.round(quotient);
}