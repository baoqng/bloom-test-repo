export function roundQtyV2(x: number): number {
  const result = Math.round(x);
  return result === 0 ? 0 : result;
}