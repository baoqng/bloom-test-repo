// bloom-deps:

export function roundOffV3(x: number): number {
  const floor = Math.floor(x);
  const fraction = x - floor;

  if (fraction < 0.5) {
    return floor;
  } else if (fraction > 0.5) {
    return floor + 1;
  } else {
    // Exact half: round to nearest even (banker's rounding)
    return floor % 2 === 0 ? floor : floor + 1;
  }
}