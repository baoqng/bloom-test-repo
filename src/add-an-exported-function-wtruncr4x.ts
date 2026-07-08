export function wTruncR4(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const diffFloor = x - floor;
  const diffCeil = ceil - x;
  if (Math.abs(diffFloor - diffCeil) < 1e-9) {
    // Halfway case: round to even
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return Math.round(x);
}