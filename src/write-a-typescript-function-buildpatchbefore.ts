// bloom-deps:

type PatchOp = { op: 'add' | 'remove' | 'replace'; path: string; value?: unknown };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildPatch(
  before: Record<string, unknown>,
  after: Record<string, unknown>
): Array<PatchOp> {
  if (!isPlainObject(before)) {
    throw new TypeError('before must be a plain object');
  }
  if (!isPlainObject(after)) {
    throw new TypeError('after must be a plain object');
  }

  const patch: Array<PatchOp> = [];

  const beforeKeys = new Set(Object.keys(before));
  const afterKeys = new Set(Object.keys(after));

  // Keys only in before -> remove
  for (const key of beforeKeys) {
    if (!afterKeys.has(key)) {
      patch.push({ op: 'remove', path: `/${key}` });
    }
  }

  // Keys only in after -> add
  for (const key of afterKeys) {
    if (!beforeKeys.has(key)) {
      patch.push({ op: 'add', path: `/${key}`, value: after[key] });
    }
  }

  // Keys in both -> compare
  for (const key of beforeKeys) {
    if (afterKeys.has(key)) {
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        patch.push({ op: 'replace', path: `/${key}`, value: after[key] });
      }
    }
  }

  return patch;
}