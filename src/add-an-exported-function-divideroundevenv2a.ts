// bloom-deps:

import { existsSync, readFileSync, writeFileSync } from 'fs';

export function divideRoundEvenV2(a: number, b: number): number {
  if (typeof a !== 'number' || typeof b !== 'number' || !isFinite(a) || !isFinite(b) || isNaN(a) || isNaN(b)) {
    throw new TypeError('Invalid input: a and b must be finite numbers');
  }

  if (b === 0) {
    throw new RangeError('division by zero');
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