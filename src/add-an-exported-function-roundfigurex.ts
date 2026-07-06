export function roundFigure(x: number): number {
  const result = Math.round(x);
  // Convert -0 to +0
  return result === 0 ? 0 : result;
}