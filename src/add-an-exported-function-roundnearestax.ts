// bloom-deps:

export function roundNearestA(x: number): number {
  const floor = Math.floor(x);
  const fract = x - floor;

  if (fract === 0.5) {
    return floor + 1;
  }

  return Math.round(x);
}