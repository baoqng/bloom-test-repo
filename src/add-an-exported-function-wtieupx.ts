export function wTieUp(x: number): number {
  const f = Math.floor(x);
  const c = f + 1;
  const diff = x - f;
  if (diff < 0.5) {
    return f;
  } else if (diff > 0.5) {
    return c;
  } else {
    // Exactly 0.5: round to even (banker's rounding)
    if (f % 2 === 0) {
      return f;
    } else {
      return c;
    }
  }
}