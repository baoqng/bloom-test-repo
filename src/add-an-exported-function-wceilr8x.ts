export function wCeilR8(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const frac = x - floor;
  const EPSILON = 1e-9;
  if (Math.abs(frac - 0.5) < EPSILON) {
    // Exactly half: round to even
    const low = floor;
    const high = floor + 1;
    if (low % 2 === 0) return low;
    return high;
  }
  return Math.round(x);
}