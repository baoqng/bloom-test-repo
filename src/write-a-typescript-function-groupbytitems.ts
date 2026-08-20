// bloom-deps:

function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }
  if (typeof keyFn !== 'function') {
    throw new TypeError('keyFn must be a function');
  }

  if (items.length === 0) {
    return {};
  }

  const result: Record<string, T[]> = {};

  for (const item of items) {
    const key = keyFn(item);
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = [];
    }
    result[key].push(item);
  }

  return result;
}

export { groupBy };