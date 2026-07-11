export function wTieAwayR6(x: number): number {
  const f = Math.floor(x);
  const d = x - f;
  if (d < 0.5) return f;
  if (d > 0.5) return f + 1;
  // Exact tie: round to even (banker's rounding)
  if (f % 2 === 0) return f;
  return f + 1;
}