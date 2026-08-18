// bloom-deps:

function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  if (!Array.isArray(array)) {
    throw new TypeError(`array must be an Array`);
  }
  if (typeof keyFn !== 'function') {
    throw new TypeError(`keyFn must be a function`);
  }

  const result: Record<string, T[]> = {};

  for (const item of array) {
    const key = keyFn(item);
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = [];
    }
    result[key].push(item);
  }

  return result;
}

export { groupBy };