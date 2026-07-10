export function wTieUp(x: number): number {
  if (!isFinite(x)) return x;
  const f = Math.floor(x);
  const diff = x - f;
  if (diff < 0.5) {
    return f;
  } else if (diff > 0.5) {
    return f + 1;
  } else {
    // Exact tie: round half to even (banker's rounding)
    // f is the lower integer, f+1 is the upper integer
    if (f % 2 === 0) {
      return f;
    } else {
      return f + 1;
    }
  }
}