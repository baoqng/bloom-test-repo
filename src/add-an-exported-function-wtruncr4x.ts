export function wTruncR4(x: number): number {
  const sign = Math.sign(x);
  const abs = Math.abs(x);
  const floor = Math.floor(abs);
  const frac = abs - floor;
  const diff = Math.abs(frac - 0.5);
  
  if (diff < 1e-9) {
    // Exact half: round to even (banker's rounding)
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) {
      return sign * lower;
    } else {
      return sign * upper;
    }
  } else {
    // Not a half: round normally
    return sign * Math.round(abs);
  }
}