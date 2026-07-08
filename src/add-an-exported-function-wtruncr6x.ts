export function wTruncR6(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const decimal = x - floor;
  const diff = Math.abs(decimal - 0.5);
  if (diff < 1e-9) {
    // Tie: round to even
    const low = floor;
    const high = floor + 1;
    if (low % 2 === 0) return low;
    return high;
  } else if (decimal < 0.5) {
    return floor;
  } else {
    return floor + 1;
  }
}