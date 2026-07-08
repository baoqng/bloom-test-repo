export function wTruncR4(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const diffFloor = x - floor;
  const diffCeil = ceil - x;
  const epsilon = 1e-9;
  if (Math.abs(diffFloor - diffCeil) < epsilon) {
    // Tie: round to even
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return Math.round(x);
}