export function wTrunc(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  const floored = Math.floor(x);
  const diff = x - floored;
  if (Math.abs(diff - 0.5) < 1e-9) {
    // Tie case: round to even
    const lower = floored;
    const upper = floored + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return Math.round(x);
}