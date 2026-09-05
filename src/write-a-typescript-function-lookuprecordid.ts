// bloom-deps:

export function lookupRecord(id: string, store: Map<string, unknown>): unknown {
  // Validate that id is a string
  if (typeof id !== 'string') {
    throw new TypeError(`id must be a string, received ${typeof id}`);
  }

  // Validate that id is not empty
  if (id.length === 0) {
    throw new RangeError('id must not be an empty string');
  }

  // Check if id exists in the store
  if (!store.has(id)) {
    throw new Error(`id "${id}" not found in store`);
  }

  // Return the associated record value
  return store.get(id);
}