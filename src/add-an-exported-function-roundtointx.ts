// bloom-deps:

export function roundToInt(x: number): number {
  const floor = Math.floor(x);
  const remainder = x - floor;

  // For exact halves, round to nearest even integer (banker's rounding)
  if (remainder === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For negative numbers with exact half, apply banker's rounding
  if (remainder === -0.5) {
    const absFloor = Math.ceil(x);
    return absFloor % 2 === 0 ? absFloor : absFloor - 1;
  }

  // For all other cases, use standard rounding
  const result = Math.round(x);
  // Handle -0 case: convert -0 to +0
  return result === 0 ? 0 : result;
}