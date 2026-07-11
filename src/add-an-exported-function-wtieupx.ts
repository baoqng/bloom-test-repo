export function wTieUp(x: number): number {
  const f = Math.floor(x);
  const frac = x - f;
  if (frac < 0.5) {
    return f;
  } else if (frac > 0.5) {
    return f + 1;
  } else {
    // Tie: round to even
    if (f % 2 === 0) {
      return f;
    } else {
      return f + 1;
    }
  }
}