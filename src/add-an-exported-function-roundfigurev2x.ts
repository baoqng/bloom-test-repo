// bloom-deps:

export function roundFigureV2(x: number): number {
  // Banker's rounding: round halves to nearest even integer
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fraction = x - floor;

  // If not a half, use standard rounding
  if (fraction !== 0.5 && fraction !== -0.5) {
    return Math.round(x);
  }

  // For exact halves, round to nearest even
  if (fraction === 0.5) {
    // Positive half: round to even
    return floor % 2 === 0 ? floor : ceil;
  } else {
    // Negative half: round to even
    return ceil % 2 === 0 ? ceil : floor;
  }
}