export function wIdentity(x: number): number {
  if (!isFinite(x)) return x;
  const sign = Math.sign(x);
  const abs = Math.abs(x);
  const floor = Math.floor(abs);
  const frac = abs - floor;
  // Banker's rounding (round half to even)
  if (Math.abs(frac - 0.5) < 1e-9) {
    // Exactly halfway: round to even
    if (floor % 2 === 0) {
      return sign * floor;
    } else {
      return sign * (floor + 1);
    }
  } else {
    return sign * Math.round(abs);
  }
}