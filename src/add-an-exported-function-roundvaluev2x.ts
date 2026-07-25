// bloom-deps:

export function roundValueV2(x: number): number {
  const floor = Math.floor(x);
  const fraction = x - floor;

  // Not a half case, use normal rounding
  if (Math.abs(fraction - 0.5) > 1e-10) {
    return Math.round(x);
  }

  // It's a half case: round to nearest even
  const rounded = floor + (floor % 2 === 0 ? 0 : 1);
  return rounded;
}