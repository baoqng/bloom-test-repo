// bloom-deps:

export function roundAmountV2(x: number): number {
  const floor = Math.floor(x);
  const remainder = x - floor;

  if (remainder < 0.5) {
    return floor;
  } else if (remainder > 0.5) {
    return floor + 1;
  } else {
    // Exactly 0.5: round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  }
}