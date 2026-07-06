export function wTruncR2(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const decimal = x - floor;
  // Handle floating point precision issues
  const fracRounded = Math.round(decimal * 1e10) / 1e10;
  if (Math.abs(fracRounded - 0.5) < 1e-9) {
    // Exactly half: round to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  } else {
    const result = Math.round(x);
    // Avoid -0
    return result === 0 ? 0 : result;
  }
}