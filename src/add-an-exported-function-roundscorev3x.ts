// bloom-deps:

import { bankerRound } from './bankerRound';

export function roundScoreV3(x: number): number {
  const floor = Math.floor(x);
  const diff = x - floor;

  if (diff < 0.5) {
    return floor;
  } else if (diff > 0.5) {
    return floor + 1;
  } else {
    // Exactly 0.5 — use banker's rounding (round to nearest even)
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  }
}