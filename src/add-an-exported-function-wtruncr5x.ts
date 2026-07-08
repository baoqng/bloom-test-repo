export function wTruncR5(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const diffFloor = x - floor;
  const diffCeil = ceil - x;
  const eps = 1e-9;
  if (Math.abs(diffFloor - diffCeil) < eps) {
    // Exactly halfway: round to even
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return Math.round(x);
}