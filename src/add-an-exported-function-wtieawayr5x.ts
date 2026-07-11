export function wTieAwayR5(x: number): number {
  const f = Math.floor(x);
  const d = x - f;
  if (d < 0.5) return f;
  if (d > 0.5) return f + 1;
  // Exact tie: round to even (banker's rounding)
  // f is the floor. The two candidates are f and f+1.
  // Pick the one that is even.
  if (f % 2 === 0) return f;
  return f + 1;
}