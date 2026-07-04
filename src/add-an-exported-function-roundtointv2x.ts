// bloom-deps:

export function roundToIntV2(x: number): number {
  const floor = Math.floor(x);
  const diff = x - floor;

  if (diff < 0.5) {
    return floor;
  } else if (diff > 0.5) {
    return floor + 1;
  } else {
    // Exact half: round to nearest even (banker's rounding)
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  }
}