// bloom-deps:

export function roundQty(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fraction = x - floor;

  // If exactly halfway between two integers, round to nearest even
  if (fraction === 0.5) {
    return floor % 2 === 0 ? floor : ceil;
  }

  // If exactly halfway between two negative integers
  if (fraction === -0.5 || (x < 0 && x - ceil === 0.5)) {
    return ceil % 2 === 0 ? ceil : floor;
  }

  // Standard rounding for non-halfway cases
  return Math.round(x);
}