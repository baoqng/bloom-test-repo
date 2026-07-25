// bloom-deps:

export function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}