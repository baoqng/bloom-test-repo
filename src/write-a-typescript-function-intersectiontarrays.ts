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
      for (const item of arr) {
        if (Object.is(item, element) || item === element) {
          return true;
        }
      }
      // Handle NaN via SameValueZero: NaN === NaN is false with ===, but Object.is(NaN, NaN) is true
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