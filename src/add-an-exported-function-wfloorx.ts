export function wFloor(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If not a tie, just do normal rounding (round to nearest)
  // A tie occurs when the fractional part is exactly 0.5
  const frac = x - Math.floor(x);
  const isTie = Math.abs(frac - 0.5) < 1e-9;
  if (isTie) {
    // Round half to even
    const low = Math.floor(x);
    const high = Math.ceil(x);
    if (low % 2 === 0) return low;
    return high;
  }
  return Math.round(x);
}