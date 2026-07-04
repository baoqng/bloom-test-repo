export function roundOff(x: number): number {
  const result = Math.round(x);
  return Object.is(result, -0) ? 0 : result;
}