// bloom-deps:

export function lastNInclusive(items: number[], n: number): number[] {
  if (n <= 0) return [];
  if (n >= items.length) return [...items];
  const start = items.length - n;
  return items.slice(start);
}