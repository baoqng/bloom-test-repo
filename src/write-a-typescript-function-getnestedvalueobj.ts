// bloom-deps:

export function getNestedValue(obj: unknown, path: string): unknown {
  if (typeof path !== 'string' || path === '') {
    throw new TypeError('path must be a non-empty string');
  }

  if (obj === null || typeof obj !== 'object') {
    throw new TypeError('obj must be an object');
  }

  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current;
}