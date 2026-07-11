export function wTruncR6(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const diff = x - floor;
  if (Math.abs(diff - 0.5) < 1e-9) {
    // Tie: round to even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  } else {
    return Math.round(x);
  }
}