// bloom-deps:

export function flattenOne<T>(arr: (T | T[])[]): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }

  const result: T[] = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      for (const subItem of item) {
        result.push(subItem);
      }
    } else {
      result.push(item);
    }
  }

  return result;
}