// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildPatch(
  before: Record<string, unknown>,
  after: Record<string, unknown>
): Array<{ op: 'add' | 'remove' | 'replace'; path: string; value?: unknown }> {
  if (!isPlainObject(before)) {
    throw new TypeError('before must be a plain object');
  }
  if (!isPlainObject(after)) {
    throw new TypeError('after must be a plain object');
  }

  const patch: Array<{ op: 'add' | 'remove' | 'replace'; path: string; value?: unknown }> = [];

  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);

  // Handle keys in before
  for (const key of beforeKeys) {
    const path = `/${key}`;
    if (!Object.prototype.hasOwnProperty.call(after, key)) {
      // Key only in before -> remove
      patch.push({ op: 'remove', path });
    } else {
      // Key in both -> check if values differ
      const beforeVal = before[key];
      const afterVal = after[key];
      if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
        patch.push({ op: 'replace', path, value: afterVal });
      }
      // If equal, omit
    }
  }

  // Handle keys only in after
  for (const key of afterKeys) {
    if (!Object.prototype.hasOwnProperty.call(before, key)) {
      patch.push({ op: 'add', path: `/${key}`, value: after[key] });
    }
  }

  return patch;
}