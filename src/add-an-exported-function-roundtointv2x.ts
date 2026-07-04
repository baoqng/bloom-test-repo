// bloom-deps:

import { bankerRound } from './bankerRound';

export function roundToIntV2(x: number): number {
  const floor = Math.floor(x);
  const diff = x - floor;

  if (diff === 0.5) {
    // Banker's rounding: round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  }

  const result = Math.round(x);
  // Ensure positive zero is returned instead of negative zero
  return result === 0 ? 0 : result;
}