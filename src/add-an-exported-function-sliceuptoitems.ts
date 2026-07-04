// bloom-deps:

export function sliceUpTo(items: string[], endIndex: number): string[] {
  if (endIndex < 0) {
    return [];
  }

  if (endIndex >= items.length) {
    return items.slice();
  }

  return items.slice(0, endIndex + 1);
}