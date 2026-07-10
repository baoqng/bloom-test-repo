export function wTieUp(x: number): number {
  if (!isFinite(x)) return x;
  const f = Math.floor(x);
  const diff = x - f;
  if (diff < 0.5) {
    return f;
  } else if (diff > 0.5) {
    return f + 1;
  } else {
    // Exact tie: round to even (banker's rounding)
    const lower = f;
    const upper = f + 1;
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  }
}