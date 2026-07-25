// bloom-deps:

export function roundValue(x: number): number {
  // Banker's rounding (round half to nearest even)
  // This is the default behavior of Math.round in JavaScript for most cases,
  // but we need to explicitly handle the .5 case
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const remainder = x - floor;

  // If not exactly at 0.5, use standard rounding
  if (remainder !== 0.5) {
    return Math.round(x);
  }

  // At exactly 0.5: round to nearest even
  // If floor is even, round down; if floor is odd, round up
  return floor % 2 === 0 ? floor : ceil;
}