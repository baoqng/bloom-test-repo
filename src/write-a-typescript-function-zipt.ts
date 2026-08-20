// bloom-deps:

function zip<T extends unknown[][]>(...arrays: T): { [K in keyof T]: T[K] extends (infer U)[] ? U : never }[] {
  for (let i = 0; i < arrays.length; i++) {
    if (!Array.isArray(arrays[i])) {
      throw new TypeError(`Argument at index ${i} is not an array`);
    }
  }

  if (arrays.length === 0) {
    return [];
  }

  const minLength = Math.min(...arrays.map(arr => arr.length));

  if (minLength === 0) {
    return [];
  }

  const result: unknown[][] = [];

  for (let i = 0; i < minLength; i++) {
    const tuple: unknown[] = [];
    for (let j = 0; j < arrays.length; j++) {
      tuple.push(arrays[j][i]);
    }
    result.push(tuple);
  }

  return result as { [K in keyof T]: T[K] extends (infer U)[] ? U : never }[];
}

export { zip };