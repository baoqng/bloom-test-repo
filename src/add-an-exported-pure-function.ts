// bloom-deps:

export function lastN_12(arr: unknown[], n: number): unknown[] {
  if (n < 0) {
    return [];
  }
  if (n === 0) {
    return [];
  }
  if (n >= arr.length) {
    return arr;
  }
  return arr.slice(-n);
}