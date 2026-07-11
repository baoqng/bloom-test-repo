export function wTieAwayR5(x: number): number {
  const f = Math.floor(x);
  const c = f + 1;
  const d = x - f;
  if (d < 0.5) return f;
  if (d > 0.5) return c;
  // Exact tie: round to even
  if (f % 2 === 0) return f;
  return c;
}