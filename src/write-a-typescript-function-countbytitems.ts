// bloom-deps:

function countBy<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }
  if (typeof keyFn !== 'function') {
    throw new TypeError('keyFn must be a function');
  }
  if (items.length === 0) {
    return {};
  }
  const result: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] += 1;
    } else {
      result[key] = 1;
    }
  }
  return result;
}

export { countBy };