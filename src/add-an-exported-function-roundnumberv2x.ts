// bloom-deps:

export function roundNumberV2(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fraction = x - floor;

  if (fraction < 0.5) {
    return floor;
  }

  if (fraction > 0.5) {
    return ceil;
  }

  // fraction === 0.5: round to nearest even
  return floor % 2 === 0 ? floor : ceil;
}