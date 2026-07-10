export function wTieUp(x: number): number {
  if (!isFinite(x)) return x;
  const f = Math.floor(x);
  const diff = x - f;
  if (Math.abs(diff - 0.5) < 1e-9) {
    // Banker's rounding: tie goes to nearest even
    const lower = f;
    const upper = f + 1;
    if (lower % 2 === 0) return lower;
    if (upper % 2 === 0) return upper;
    // Both odd shouldn't happen for integers, but fallback
    return upper;
  }
  return diff < 0.5 ? f : f + 1;
}