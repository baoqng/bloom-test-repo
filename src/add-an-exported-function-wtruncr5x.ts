export function wTruncR5(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const decimal = x - floor;
  const halfTest = Math.abs(decimal - 0.5);
  if (halfTest < 1e-9) {
    // Exact half: round to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return Math.round(x);
}