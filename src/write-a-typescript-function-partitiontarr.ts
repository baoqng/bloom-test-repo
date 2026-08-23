// bloom-deps:

function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }
  if (typeof predicate !== 'function') {
    throw new TypeError('predicate must be a function');
  }

  const trueItems: T[] = [];
  const falseItems: T[] = [];

  for (const item of arr) {
    if (predicate(item)) {
      trueItems.push(item);
    } else {
      falseItems.push(item);
    }
  }

  return [trueItems, falseItems];
}

export { partition };