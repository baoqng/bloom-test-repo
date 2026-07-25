// bloom-deps:

export function roundAmount(x: number): number {
  const rounded = Math.round(x);
  const fractionalPart = x - Math.floor(x);

  if (fractionalPart === 0.5) {
    const floor = Math.floor(x);
    return floor % 2 === 0 ? floor : floor + 1;
  }

  if (fractionalPart === -0.5) {
    const ceil = Math.ceil(x);
    return ceil % 2 === 0 ? ceil : ceil - 1;
  }

  return rounded;
}