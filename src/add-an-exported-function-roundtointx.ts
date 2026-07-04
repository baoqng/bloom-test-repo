export function roundToInt(x: number): number {
  const result = Math.round(x);
  // Convert -0 to +0 to satisfy Object.is equality checks
  return result === 0 ? 0 : result;
}