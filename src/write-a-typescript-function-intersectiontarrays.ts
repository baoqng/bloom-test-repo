// bloom-deps:

function intersection<T>(...arrays: T[][]): T[] {
  for (let i = 0; i < arrays.length; i++) {
    if (!Array.isArray(arrays[i])) {
      throw new TypeError(`Argument at index ${i} is not an array`);
    }
  }

  if (arrays.length === 0) {
    return [];
  }

  if (arrays.length === 1) {
    return [...arrays[0]];
  }

  const first = arrays[0];
  const rest = arrays.slice(1);

  const seen = new Set<T>();
  const result: T[] = [];

  for (const element of first) {
    if (seen.has(element)) {
      continue;
    }

    const inAll = rest.every((arr) => {
      for (let i = 0; i < arr.length; i++) {
        const a = arr[i];
        const b = element;
        // SameValueZero equality
        if (a === b || (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b))) {
          return true;
        }
      }
      return false;
    });

    if (inAll) {
      seen.add(element);
      result.push(element);
    }
  }

  return result;
}

export { intersection };