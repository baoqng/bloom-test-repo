// bloom-deps:

import { existsSync } from "fs";

export function divideRoundEven(a: number, b: number): number {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Both arguments must be numbers");
  }

  if (isNaN(a) || isNaN(b)) {
    throw new TypeError("Arguments must not be NaN");
  }

  if (b === 0) {
    throw new RangeError("division by zero");
  }

  const quotient = a / b;
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