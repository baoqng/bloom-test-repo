// bloom-deps:

function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, but received: ${typeof arr}`);
  }
  if (typeof predicate !== 'function') {
    throw new TypeError(`Expected predicate to be a function, but received: ${typeof predicate}`);
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