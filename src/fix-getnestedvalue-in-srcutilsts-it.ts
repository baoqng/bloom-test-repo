// bloom-deps:

export function getNestedValue(obj: unknown, key: unknown): unknown {
  if (obj === null || obj === undefined) {
    throw new TypeError('obj is required');
  }
  if (key === null || key === undefined) {
    throw new TypeError('key is required');
  }
  if (typeof key !== 'string') {
    throw new TypeError('key must be a string');
  }
  if (key.trim() === '') {
    throw new TypeError('key cannot be empty');
  }
  if (!Object.prototype.hasOwnProperty.call(obj, key)) {
    throw new ReferenceError('property not found: ' + key);
  }
  return (obj as Record<string, unknown>)[key];
}