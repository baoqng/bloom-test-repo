// bloom-deps:

function partitionByPredicate<T>(items: unknown, predicate: unknown): [T[], T[]] {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }
  if (typeof predicate !== "function") {
    throw new TypeError("predicate must be a function");
  }

  const truthy: T[] = [];
  const falsy: T[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as T;
    if (predicate(item, i)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }

  return [truthy, falsy];
}

export { partitionByPredicate };