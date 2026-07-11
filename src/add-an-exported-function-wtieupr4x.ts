export function wTieUpR4(x: number): number {
  if (!isFinite(x)) return x;
  const f = Math.floor(x);
  const diff = x - f;
  if (diff < 0.5) {
    return f;
  } else if (diff > 0.5) {
    return f + 1;
  } else {
    // Exactly 0.5: round to even (banker's rounding)
    if (f % 2 === 0) {
      return f;
    } else {
      return f + 1;
    }
  }
}