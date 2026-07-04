export function roundScore(x: number): number {
  const result = Math.round(x);
  return result === 0 ? 0 : result;
}