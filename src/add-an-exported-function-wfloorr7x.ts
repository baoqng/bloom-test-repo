export function wFloorR7(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If not a tie, Math.round is fine (but Math.round rounds .5 up, so we need custom logic)
  // Implement banker's rounding from scratch
  const floor = Math.floor(x);
  const frac = x - floor;
  const EPS = 1e-9;
  if (Math.abs(frac - 0.5) < EPS) {
    // It's a tie: round to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  } else {
    return Math.round(x);
  }
}