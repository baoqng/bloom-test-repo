// bloom-deps:

export function zip<A, B>(a: A[], b: B[]): [A, B][] {
  if (!Array.isArray(a)) {
    throw new TypeError(`Expected first argument to be an Array, got ${typeof a}`);
  }
  if (!Array.isArray(b)) {
    throw new TypeError(`Expected second argument to be an Array, got ${typeof b}`);
  }

  const length = Math.min(a.length, b.length);
  const result: [A, B][] = [];

  for (let i = 0; i < length; i++) {
    result.push([a[i], b[i]]);
  }

  return result;
}