export function wIdentity(x: number): number {
  if (!isFinite(x)) return x;
  const sign = x >= 0 ? 1 : -1;
  const abs = Math.abs(x);
  const floor = Math.floor(abs);
  const frac = abs - floor;
  if (Math.abs(frac - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    if (floor % 2 === 0) {
      return sign * floor;
    } else {
      return sign * (floor + 1);
    }
  } else {
    return sign * Math.round(abs);
  }
}