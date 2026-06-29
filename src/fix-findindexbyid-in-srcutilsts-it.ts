// bloom-deps:

export function findIndexById<T extends { id: unknown }>(items: T[], id: unknown): number {
  if (items === null || items === undefined) {
    throw new TypeError('items is required');
  }
  if (id === null || id === undefined) {
    throw new TypeError('id is required');
  }
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an Array');
  }
  return items.findIndex(item => item.id === id);
}