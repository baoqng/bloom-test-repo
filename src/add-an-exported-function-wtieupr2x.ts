export function wTieUpR2(x: number): number {
  if (!isFinite(x)) return x;
  if (x === 0) return 0;
  const f = Math.floor(x);
  const diff = x - f;
  if (Math.abs(diff - 0.5) < Number.EPSILON) {
    // Round half to even
    if (f % 2 === 0) {
      return f;
    } else {
      return f + 1;
    }
  }
  return diff < 0.5 ? f : f + 1;
}