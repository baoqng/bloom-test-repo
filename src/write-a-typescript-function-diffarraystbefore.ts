// bloom-deps:

function diffArrays<T>(before: T[], after: T[]): { added: T[]; removed: T[]; unchanged: T[] } {
  if (!Array.isArray(before)) {
    throw new TypeError('before must be an Array');
  }
  if (!Array.isArray(after)) {
    throw new TypeError('after must be an Array');
  }

  const beforeSet = new Set<T>(before);
  const afterSet = new Set<T>(after);

  const added: T[] = [];
  const removed: T[] = [];
  const unchanged: T[] = [];

  for (const item of afterSet) {
    if (beforeSet.has(item)) {
      unchanged.push(item);
    } else {
      added.push(item);
    }
  }

  for (const item of beforeSet) {
    if (!afterSet.has(item)) {
      removed.push(item);
    }
  }

  return { added, removed, unchanged };
}

export { diffArrays };