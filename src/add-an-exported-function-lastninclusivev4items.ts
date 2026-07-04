// bloom-deps:

export function lastNInclusiveV4(items: number[], n: number): number[] {
  if (n <= 0) return [];
  if (n >= items.length) return [...items];
  const offset = items.length - n;
  return items.slice(offset);
}