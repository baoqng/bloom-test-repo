// bloom-deps:

export function roundToInt(x: number): number {
  const floor = Math.floor(x);
  const diff = x - floor;

  if (diff > 0.5) {
    return floor + 1;
  } else if (diff < 0.5) {
    return floor;
  } else {
    // Banker's rounding: round to nearest even
    return floor % 2 === 0 ? floor : floor + 1;
  }
}