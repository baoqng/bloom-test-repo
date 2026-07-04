// bloom-deps:

export function roundQtyV2(x: number): number {
  const floor = Math.floor(x);
  const fractional = x - floor;

  if (fractional < 0.5) {
    return floor;
  } else if (fractional > 0.5) {
    return floor + 1;
  } else {
    // Exactly 0.5: round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  }
}