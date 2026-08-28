// bloom-deps:

export function partitionArray<T>(arr: unknown, predicate: unknown): [T[], T[]] {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an array');
  }
  if (typeof predicate !== 'function') {
    throw new TypeError('predicate must be a function');
  }

  const truthy: T[] = [];
  const falsy: T[] = [];

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i] as T;
    if (predicate(element, i, arr)) {
      truthy.push(element);
    } else {
      falsy.push(element);
    }
  }

  return [truthy, falsy];
}