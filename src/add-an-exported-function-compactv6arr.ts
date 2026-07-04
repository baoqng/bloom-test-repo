// bloom-deps:

export function compactV6(arr: unknown[]): unknown[] {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr.filter((item) => {
    return Boolean(item);
  });
}