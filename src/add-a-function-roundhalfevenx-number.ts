// bloom-deps:

export function roundHalfEven(x: number): number {
  const floor = Math.floor(x);
  const diff = x - floor;

  if (diff < 0.5) {
    return floor;
  }

  if (diff > 0.5) {
    return floor + 1;
  }

  // Exactly halfway: round to even
  if (floor % 2 === 0) {
    return floor;
  }

  return floor + 1;
}