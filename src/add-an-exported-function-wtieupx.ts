export function wTieUp(x: number): number {
  if (!isFinite(x)) return x;
  if (Object.is(x, -0)) return 0;
  const f = Math.floor(x);
  const diff = x - f;
  if (diff < 0.5) {
    return f;
  } else if (diff > 0.5) {
    return f + 1;
  } else {
    // Exactly 0.5 — banker's rounding: round to even
    if (f % 2 === 0) {
      return f;
    } else {
      return f + 1;
    }
  }
}