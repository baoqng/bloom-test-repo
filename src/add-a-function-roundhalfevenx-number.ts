// bloom-deps:

export function roundHalfEven(x: number): number {
  const floor = Math.floor(x);
  const fract = x - floor;

  if (fract === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  } else if (fract === -0.5) {
    return floor % 2 === 0 ? floor : floor - 1;
  }

  return Math.round(x);
}