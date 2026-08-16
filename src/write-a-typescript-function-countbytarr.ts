// bloom-deps:

function countBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, number> {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, but received ${typeof arr}`);
  }

  if (typeof keyFn !== 'function') {
    throw new TypeError(`Expected keyFn to be a function, but received ${typeof keyFn}`);
  }

  const result: Record<string, number> = {};

  for (const item of arr) {
    const key = keyFn(item);

    if (typeof key !== 'string') {
      throw new TypeError(`keyFn must return a string, but returned ${JSON.stringify(key)}`);
    }

    if (Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] += 1;
    } else {
      result[key] = 1;
    }
  }

  return result;
}

export { countBy };