export function wTruncR3(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const decimal = x - floor;
  // Check if exactly 0.5
  if (Math.abs(decimal - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    const low = floor;
    const high = floor + 1;
    if (low % 2 === 0) return low;
    return high;
  }
  return Math.round(x);
}