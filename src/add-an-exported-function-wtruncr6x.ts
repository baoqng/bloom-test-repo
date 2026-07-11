export function wTruncR6(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const frac = x - floor;
  const diff = Math.abs(frac - 0.5);
  if (diff < 1e-9) {
    // Exact half: round to even
    const low = floor;
    const high = floor + 1;
    if (low % 2 === 0) return low;
    return high;
  }
  return Math.round(x);
}