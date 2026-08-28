// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function diffObjectKeys<T extends Record<string, unknown>>(
  before: unknown,
  after: unknown
): { added: string[]; removed: string[]; changed: string[]; unchanged: string[] } {
  if (!isPlainObject(before)) {
    throw new TypeError('before must be a plain object');
  }
  if (!isPlainObject(after)) {
    throw new TypeError('after must be a plain object');
  }

  const beforeKeys = new Set(Object.keys(before));
  const afterKeys = new Set(Object.keys(after));

  const added: string[] = [];
  const removed: string[] = [];
  const changed: string[] = [];
  const unchanged: string[] = [];

  for (const key of afterKeys) {
    if (!beforeKeys.has(key)) {
      added.push(key);
    }
  }

  for (const key of beforeKeys) {
    if (!afterKeys.has(key)) {
      removed.push(key);
    } else {
      if (before[key] === after[key]) {
        unchanged.push(key);
      } else {
        changed.push(key);
      }
    }
  }

  added.sort();
  removed.sort();
  changed.sort();
  unchanged.sort();

  return { added, removed, changed, unchanged };
}