export function wTieAwayR7(x: number): number {
  const f = Math.floor(x);
  const d = x - f;
  if (d < 0.5) return f;
  if (d > 0.5) return f + 1;
  // Exact tie: round to even
  const lower = f;
  const upper = f + 1;
  if (lower % 2 === 0) return lower;
  return upper;
}