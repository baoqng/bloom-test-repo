export function wTrunc(x: number): number {
  if (typeof x !== 'number') return NaN;
  if (!isFinite(x) || x !== x) return x;
  if (x === 0) return x;

  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const frac = x - floor; // always in [0, 1)

  // Exact 0.5 tie: banker's rounding (round half to even)
  if (Math.abs(frac - 0.5) < 1e-14) {
    // It's a tie — pick the even neighbor
    if (floor % 2 === 0) return floor;
    return ceil;
  }

  // Otherwise, standard rounding
  return Math.round(x);
}