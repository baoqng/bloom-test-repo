export function wTruncR8(x: number): number {
  if (!isFinite(x)) return x;
  const sign = Math.sign(x);
  const abs = Math.abs(x);
  const floor = Math.floor(abs);
  const frac = abs - floor;
  const diff = frac - 0.5;
  if (Math.abs(diff) < 1e-9) {
    // Tie: round to even
    if (floor % 2 === 0) {
      return sign * floor;
    } else {
      return sign * (floor + 1);
    }
  } else if (frac < 0.5) {
    return sign * floor;
  } else {
    return sign * (floor + 1);
  }
}