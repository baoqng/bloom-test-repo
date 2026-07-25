// bloom-deps:

export function roundToIntV2(x: number): number {
  const floor = Math.floor(x);
  const frac = x - floor;

  // Not a tie (not exactly 0.5)
  if (Math.abs(frac - 0.5) > 1e-10) {
    return frac < 0.5 ? floor : floor + 1;
  }

  // Exact tie: round to nearest even
  return floor % 2 === 0 ? floor : floor + 1;
}