export function mod(a: number, n: number): number {
  const result = ((a % n) + n) % n;
  return result === 0 ? 0 : result;
}