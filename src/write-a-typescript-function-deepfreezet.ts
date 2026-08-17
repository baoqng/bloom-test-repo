// bloom-deps:

function deepFreeze<T extends object>(obj: T): Readonly<T> {
  if (obj === null || typeof obj !== 'object') {
    throw new TypeError(`Expected a non-null object, but received ${obj === null ? 'null' : typeof obj}`);
  }

  Object.getOwnPropertyNames(obj).forEach((name) => {
    const value = (obj as Record<string, unknown>)[name];
    if (value !== null && typeof value === 'object') {
      deepFreeze(value as object);
    }
  });

  return Object.freeze(obj);
}

export { deepFreeze };