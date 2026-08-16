// bloom-deps:

function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, but received ${typeof arr}`);
  }
  if (typeof keyFn !== 'function') {
    throw new TypeError(`Expected keyFn to be a function, but received ${typeof keyFn}`);
  }

  const result: Record<string, T[]> = {};

  for (const item of arr) {
    const key = keyFn(item);
    if (typeof key !== 'string') {
      throw new TypeError(`Expected keyFn to return a string, but received ${typeof key}`);
    }
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = [];
    }
    result[key].push(item);
  }

  return result;
}

export { groupBy };