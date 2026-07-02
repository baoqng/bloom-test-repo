export function floorDiv(a: number, b: number): number {
  const result = Math.floor(a / b);
  return result === 0 ? 0 : result;
}