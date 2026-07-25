// bloom-deps:

import { existsSync } from "fs";

export function divideRoundEvenV4(a: number, b: number): number {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Both arguments must be numbers");
  }
  if (!isFinite(a) || isNaN(a)) {
    throw new TypeError("Argument 'a' must be a finite number");
  }
  if (!isFinite(b) || isNaN(b)) {
    throw new TypeError("Argument 'b' must be a finite number");
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