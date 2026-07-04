// bloom-deps:
import { roundNumber } from './utils';

export function roundNumber(x: number): number {
  const floor = Math.floor(x);
  const diff = x - floor;
  if (diff === 0.5) {
    // Banker's rounding: round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  }
  if (diff === -0.5) {
    // Banker's rounding for negative numbers with .5
    return floor % 2 === 0 ? floor : floor - 1;
  }
  const rounded = Math.round(x);
  // Ensure +0 is returned instead of -0
  return rounded === 0 ? 0 : rounded;
}