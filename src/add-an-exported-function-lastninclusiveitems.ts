// bloom-deps:

export function lastNInclusive(items: number[], n: number): number[] {
  if (n <= 0) {
    return [];
  }

  if (n >= items.length) {
    return items.slice();
  }

  return items.slice(-n);
}