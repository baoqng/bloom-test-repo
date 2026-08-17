// bloom-deps:

export function add(a: number, b: number): number {
  if (!isFinite(a) || !isFinite(b)) {
    throw new TypeError('Both arguments must be finite numbers');
  }
  return a + b;
}