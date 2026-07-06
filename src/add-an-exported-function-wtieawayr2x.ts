export function wTieAwayR2(x: number): number {
  if (x !== x) return NaN; // NaN
  if (x === Infinity || x === -Infinity) return x;
  if (x === 0) return 0; // handles -0 -> +0
  const f = Math.floor(x);
  const d = x - f;
  if (d < 0.5) return f === 0 ? 0 : f;
  if (d > 0.5) return f + 1;
  // exactly 0.5: round to even (banker's rounding)
  const lower = f;
  const upper = f + 1;
  if (lower % 2 === 0) return lower === 0 ? 0 : lower;
  return upper;
}