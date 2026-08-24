// bloom-deps:

function countBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, number> {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }
  if (typeof keyFn !== 'function') {
    throw new TypeError('keyFn must be a function');
  }

  const result: Record<string, number> = {};

  for (const item of arr) {
    const key = keyFn(item);
    result[key] = (result[key] ?? 0) + 1;
  }

  return result;
}

export { countBy };