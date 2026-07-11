export function wTrunc(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  const abs = Math.abs(x);
  const sign = x < 0 ? -1 : 1;
  const frac = abs - Math.floor(abs);
  const eps = 1e-9;
  if (Math.abs(frac - 0.5) < eps) {
    // Banker's rounding: round half to even
    const floor = Math.floor(abs);
    const ceil = Math.ceil(abs);
    // Pick the even one
    if (floor % 2 === 0) {
      return sign * floor;
    } else {
      return sign * ceil;
    }
  } else {
    return Math.round(x);
  }
}