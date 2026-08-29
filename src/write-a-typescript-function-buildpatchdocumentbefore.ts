// bloom-deps:

function isPlainObject(x: unknown): boolean {
  if (x === null) return false;
  if (typeof x !== 'object') return false;
  if (Array.isArray(x)) return false;
  const proto = Object.getPrototypeOf(x);
  return proto === Object.prototype || proto === null;
}

export function buildPatchDocument(
  before: unknown,
  after: unknown
): Array<{ op: string; path: string; value?: unknown }> {
  if (!isPlainObject(before)) {
    throw new TypeError('before must be a plain object');
  }
  if (!isPlainObject(after)) {
    throw new TypeError('after must be a plain object');
  }

  const beforeObj = before as Record<string, unknown>;
  const afterObj = after as Record<string, unknown>;

  const removes: Array<{ op: string; path: string }> = [];
  const adds: Array<{ op: string; path: string; value: unknown }> = [];
  const replaces: Array<{ op: string; path: string; value: unknown }> = [];

  const beforeKeys = Object.keys(beforeObj);
  const afterKeys = Object.keys(afterObj);

  for (const key of beforeKeys) {
    if (!Object.prototype.hasOwnProperty.call(afterObj, key)) {
      removes.push({ op: 'remove', path: `/${key}` });
    } else {
      if (beforeObj[key] !== afterObj[key]) {
        replaces.push({ op: 'replace', path: `/${key}`, value: afterObj[key] });
      }
    }
  }

  for (const key of afterKeys) {
    if (!Object.prototype.hasOwnProperty.call(beforeObj, key)) {
      adds.push({ op: 'add', path: `/${key}`, value: afterObj[key] });
    }
  }

  removes.sort((a, b) => a.path.localeCompare(b.path));
  adds.sort((a, b) => a.path.localeCompare(b.path));
  replaces.sort((a, b) => a.path.localeCompare(b.path));

  return [...removes, ...adds, ...replaces];
}