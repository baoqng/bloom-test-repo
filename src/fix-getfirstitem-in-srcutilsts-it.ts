// bloom-deps:

export function getFirstItem<T>(array: T[]): T | undefined {
  if (!array || array.length === 0) {
    return undefined;
  }
  return array[0];
}