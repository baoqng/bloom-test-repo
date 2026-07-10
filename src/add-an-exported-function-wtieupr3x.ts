export function wTieUpR3(x: number): number {
  if (!isFinite(x)) return x;
  const f = Math.floor(x);
  const diff = x - f;
  if (diff < 0.5) {
    return f;
  } else if (diff > 0.5) {
    return f + 1;
  } else {
    // Exact tie: round to even
    if (f % 2 === 0) {
      return f;
    } else {
      return f + 1;
    }
  }
}