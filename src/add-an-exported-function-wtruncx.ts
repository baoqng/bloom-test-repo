export function wTrunc(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  
  const fraction = x - Math.trunc(x);
  const absFraction = Math.abs(fraction);
  
  if (absFraction < 0.5) {
    // Round toward zero
    const result = Math.trunc(x);
    return result === 0 ? 0 : result; // normalize -0 to 0
  } else if (absFraction > 0.5) {
    // Round away from zero
    const result = x > 0 ? Math.ceil(x) : Math.floor(x);
    return result === 0 ? 0 : result;
  } else {
    // Exactly 0.5 - round to even (banker's rounding)
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) {
      return floor === 0 ? 0 : floor;
    } else if (ceil % 2 === 0) {
      return ceil === 0 ? 0 : ceil;
    } else {
      // Both odd shouldn't happen for integers, but fallback
      return floor === 0 ? 0 : floor;
    }
  }
}