// bloom-deps:

export function roundValueV2(x: number): number {
  const floor = Math.floor(x);
  const fraction = x - floor;

  if (fraction < 0.5) {
    return floor;
  } else if (fraction > 0.5) {
    return floor + 1;
  } else {
    // Exactly 0.5 — banker's rounding: round to nearest even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  }
}