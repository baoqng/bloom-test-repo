// bloom-deps:

export function lastNInclusiveV2(items: number[], n: number): number[] {
  if (n <= 0) {
    return [];
  }

  if (n >= items.length) {
    return [...items];
  }

  const startIndex = items.length - n;
  return items.slice(startIndex);
}