export function wCeilR5(x: number): number {
  if (Number.isInteger(x)) return x;
  const frac = x - Math.floor(x);
  const isHalf = Math.abs(frac - 0.5) < 1e-9;
  if (isHalf) {
    const lower = Math.floor(x);
    const upper = lower + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return Math.round(x);
}