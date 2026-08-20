// bloom-deps:

function flattenDeep(arr: unknown[]): unknown[] {
  if (!Array.isArray(arr)) {
    throw new TypeError('Expected an array');
  }

  const result: unknown[] = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      const flattened = flattenDeep(item);
      for (const el of flattened) {
        result.push(el);
      }
    } else {
      result.push(item);
    }
  }

  return result;
}

export { flattenDeep };