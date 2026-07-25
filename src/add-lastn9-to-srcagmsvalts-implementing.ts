export function lastN_9<T>(arr: T[], n: number): T[] {
  if (n < 0) {
    throw new Error("n must be >= 0");
  }

  n = Math.trunc(n);

  if (n === 0) {
    return [];
  }

  if (n >= arr.length) {
    return [...arr];
  }

  return arr.slice(arr.length - n);
}