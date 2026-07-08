export function wTieUp(x: number): number {
  if (!isFinite(x)) return x;
  const f = Math.floor(x);
  const diff = x - f;
  if (Math.abs(diff - 0.5) < 1e-9) {
    // Round half to even
    if (f % 2 === 0) {
      return f;
    } else {
      return f + 1;
    }
  }
  return diff < 0.5 ? f : f + 1;
}