export function wTieAwayR7(x: number): number {
  if (!isFinite(x)) return x;
  const f = Math.floor(x);
  const d = x - f;
  if (d < 0.5) return f;
  if (d > 0.5) return f + 1;
  // Exact half: round to even
  if (f % 2 === 0) return f;
  return f + 1;
}