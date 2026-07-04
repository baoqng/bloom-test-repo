// bloom-deps:

import { bankerRound } from './bankerRound';

export function roundAmountV3(x: number): number {
  const floor = Math.floor(x);
  const diff = x - floor;

  if (diff < 0.5) {
    return floor;
  } else if (diff > 0.5) {
    return floor + 1;
  } else {
    // Exact half: round to nearest even (banker's rounding)
    return floor % 2 === 0 ? floor : floor + 1;
  }
}