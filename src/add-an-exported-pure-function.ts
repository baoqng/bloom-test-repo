// bloom-deps:

export function lastN_4<T>(array: T[], n: number): T[] {
  if (n <= 0) {
    return [];
  }
  const offset = Math.max(0, array.length - n);
  return array.slice(offset);
}