export function roundBankersV2(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const frac = x - floor;

  if (Math.abs(frac) < 1e-10) {
    return floor;
  }

  if (Math.abs(frac - 1) < 1e-10) {
    return ceil;
  }

  let result: number;

  if (Math.abs(frac - 0.5) < 1e-10) {
    result = floor % 2 === 0 ? floor : ceil;
  } else {
    result = frac < 0.5 ? floor : ceil;
  }

  // Avoid returning -0; normalize to +0
  return result === 0 ? 0 : result;
}