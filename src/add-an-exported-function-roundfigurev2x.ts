// bloom-deps:

export function roundFigureV2(x: number): number {
  const floor = Math.floor(x);
  const fraction = x - floor;

  if (fraction < 0.5) {
    return floor;
  }

  if (fraction > 0.5) {
    return floor + 1;
  }

  if (fraction === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  }

  return floor;
}