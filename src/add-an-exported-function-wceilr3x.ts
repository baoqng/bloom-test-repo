export function wCeilR3(x: number): number {
  if (typeof x !== 'number' || isNaN(x) || !isFinite(x)) {
    if (typeof x === 'string') {
      return Number(x);
    }
    return Number(x);
  }
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  // Check if exactly halfway
  const absX = Math.abs(x);
  const frac = absX - Math.floor(absX);
  const isHalf = Math.abs(frac - 0.5) < 1e-9;
  if (isHalf) {
    // Banker's rounding: round to even
    const lower = x >= 0 ? Math.floor(x) : Math.ceil(x);
    const upper = x >= 0 ? Math.ceil(x) : Math.floor(x);
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  } else {
    return Math.round(x);
  }
}