// bloom-deps:

export function lastNInclusiveV8(items: number[], n: number): number[] {
  if (n <= 0) {
    return [];
  }

  if (n >= items.length) {
    return items.slice();
  }

  const startIndex = items.length - n;
  return items.slice(startIndex);
}