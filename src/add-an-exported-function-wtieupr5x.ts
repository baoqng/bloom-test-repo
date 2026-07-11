export function wTieUpR5(x: number): number {
  if (!isFinite(x)) return x;
  const f = Math.floor(x);
  const diff = x - f;
  if (Math.abs(diff - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    const lower = f;
    const upper = f + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return diff < 0.5 ? f : f + 1;
}