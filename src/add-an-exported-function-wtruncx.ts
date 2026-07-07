export function wTrunc(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const diffFloor = Math.abs(x - floor);
  const diffCeil = Math.abs(x - ceil);
  if (diffFloor < diffCeil) return floor;
  if (diffCeil < diffFloor) return ceil;
  // Exactly halfway: round to even
  if (floor % 2 === 0) return floor;
  return ceil;
}