// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function redactSensitiveFields(
  obj: unknown,
  sensitiveKeys: string[],
  options?: { replacement?: string; maxDepth?: number }
): unknown {
  // Validate obj
  if (!isPlainObject(obj) && !Array.isArray(obj)) {
    throw new TypeError('obj must be a plain object or array');
  }

  // Validate sensitiveKeys
  if (
    !Array.isArray(sensitiveKeys) ||
    !sensitiveKeys.every((k) => typeof k === 'string')
  ) {
    throw new TypeError('sensitiveKeys must be an array of strings');
  }

  const replacement = options?.replacement !== undefined ? options.replacement : '[REDACTED]';

  let maxDepth: number = Infinity;
  if (options !== undefined && options.maxDepth !== undefined) {
    const md = options.maxDepth;
    if (md !== Infinity) {
      if (!Number.isInteger(md) || md < 1) {
        throw new RangeError('maxDepth must be a positive integer');
      }
    }
    maxDepth = md;
  }

  const lowerSensitiveKeys = sensitiveKeys.map((k) => k.toLowerCase());

  const seen = new WeakSet<object>();

  function recurse(value: unknown, depth: number): unknown {
    if (Array.isArray(value)) {
      if (depth >= maxDepth) {
        // Copy as-is at maxDepth
        return value.slice();
      }
      seen.add(value);
      const result: unknown[] = value.map((item) => recurse(item, depth + 1));
      seen.delete(value);
      return result;
    }

    if (isPlainObject(value)) {
      const valueObj = value as Record<string, unknown>;
      if (depth >= maxDepth) {
        // Copy as-is at maxDepth
        return Object.assign({}, valueObj);
      }
      seen.add(valueObj);
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(valueObj)) {
        if (lowerSensitiveKeys.includes(key.toLowerCase())) {
          result[key] = replacement;
        } else {
          result[key] = recurse(valueObj[key], depth + 1);
        }
      }
      seen.delete(valueObj);
      return result;
    }

    // Primitives, null, class instances, Dates, RegExps — copy as-is
    return value;
  }

  return recurse(obj, 0);
}