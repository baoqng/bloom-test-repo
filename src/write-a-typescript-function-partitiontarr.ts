// bloom-deps:

export function partition<T>(
  arr: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  // Type validation: arr must be an Array
  if (!Array.isArray(arr)) {
    throw new TypeError(
      `Expected arr to be an Array, got ${typeof arr}`
    );
  }

  // Type validation: predicate must be a function
  if (typeof predicate !== 'function') {
    throw new TypeError(
      `Expected predicate to be a function, got ${typeof predicate}`
    );
  }

  const trueItems: T[] = [];
  const falseItems: T[] = [];

  for (const item of arr) {
    try {
      const result = predicate(item);
      if (result) {
        trueItems.push(item);
      } else {
        falseItems.push(item);
      }
    } catch (error) {
      throw new Error(
        `Predicate evaluation failed for item`,
        { cause: error }
      );
    }
  }

  return [trueItems, falseItems];
}