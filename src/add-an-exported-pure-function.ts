// bloom-deps:
export function lastN_4<T>(arr: T[], n: number): T[] {
  if (n <= 0) {
    return [];
  }
  const offset = arr.length - n;
  if (offset <= 0) {
    return arr.slice(0);
  }
  return arr.slice(offset);
}