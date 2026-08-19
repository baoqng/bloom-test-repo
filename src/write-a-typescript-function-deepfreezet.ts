// bloom-deps:

function deepFreeze<T extends object>(obj: T): Readonly<T> {
  if (obj === null || typeof obj !== 'object') {
    throw new TypeError('Input must be a non-null object');
  }

  const seen = new WeakSet<object>();

  function freeze(value: unknown): void {
    if (value === null || typeof value !== 'object') {
      return;
    }

    if (seen.has(value as object)) {
      return;
    }

    seen.add(value as object);
    Object.freeze(value);

    Object.getOwnPropertyNames(value).forEach((name) => {
      const prop = (value as Record<string, unknown>)[name];
      freeze(prop);
    });
  }

  freeze(obj);
  return obj;
}

export { deepFreeze };