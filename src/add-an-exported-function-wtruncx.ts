export function wTrunc(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  if (x === 0) return x;
  const sign = x < 0 ? -1 : 1;
  const abs = Math.abs(x);
  const floor = Math.floor(abs);
  const frac = abs - floor;
  const diff = Math.abs(frac - 0.5);
  if (diff < 1e-9) {
    // Exactly half: round to even
    if (floor % 2 === 0) {
      return sign * floor;
    } else {
      return sign * (floor + 1);
    }
  } else {
    return sign * Math.round(abs);
  }
}