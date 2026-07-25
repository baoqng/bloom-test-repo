// bloom-deps:

export function roundAmount(x: number): number {
  // Banker's rounding (round halves to nearest even)
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fraction = x - floor;

  // Exact half case: round to nearest even
  if (fraction === 0.5) {
    return floor % 2 === 0 ? floor : ceil;
  }

  // Negative exact half case
  if (fraction === -0.5) {
    return ceil % 2 === 0 ? ceil : floor;
  }

  // Standard rounding for non-half cases
  return Math.round(x);
}