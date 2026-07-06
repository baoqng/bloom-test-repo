// bloom-deps:

export function roundToInt(x: number): number {
  const floor = Math.floor(x);
  const fraction = x - floor;

  if (fraction < 0.5) {
    return floor;
  } else if (fraction > 0.5) {
    return floor + 1;
  } else {
    // Exactly 0.5 — banker's rounding: round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  }
}