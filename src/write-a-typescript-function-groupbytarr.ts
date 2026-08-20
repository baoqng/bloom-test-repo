// bloom-deps:

function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an array');
  }
  if (typeof keyFn !== 'function') {
    throw new TypeError('keyFn must be a function');
  }

  if (arr.length === 0) {
    return {};
  }

  const result: Record<string, T[]> = {};

  for (const item of arr) {
    const key = keyFn(item);
    if (typeof key !== 'string') {
      throw new TypeError('keyFn must return a string');
    }
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = [];
    }
    result[key].push(item);
  }

  return result;
}

export { groupBy };