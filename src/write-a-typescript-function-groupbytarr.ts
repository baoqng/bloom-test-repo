// bloom-deps:

function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected first argument to be an Array, got ${typeof arr}`);
  }

  if (typeof keyFn !== 'function') {
    throw new TypeError(`Expected second argument to be a function, got ${typeof keyFn}`);
  }

  const result: Record<string, T[]> = {};

  for (const item of arr) {
    const key = keyFn(item);

    if (typeof key !== 'string') {
      throw new TypeError(`keyFn must return a string, got ${JSON.stringify(key)}`);
    }

    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = [];
    }

    result[key].push(item);
  }

  return result;
}

export { groupBy };