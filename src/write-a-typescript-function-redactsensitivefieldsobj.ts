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
  if (!Array.isArray(obj) && !isPlainObject(obj)) {
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
  if (options !== undefined && 'maxDepth' in options && options.maxDepth !== undefined) {
    const md = options.maxDepth;
    if (md !== Infinity) {
      if (!Number.isInteger(md) || md <= 0) {
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
        // At maxDepth, copy as-is
        return value.slice();
      }
      if (seen.has(value)) {
        return value;
      }
      seen.add(value);
      const result = value.map((el) => recurse(el, depth + 1));
      seen.delete(value);
      return result;
    }

    if (isPlainObject(value)) {
      if (depth >= maxDepth) {
        // At maxDepth, copy as-is (shallow copy)
        return Object.assign({}, value);
      }
      const obj = value as Record<string, unknown>;
      if (seen.has(obj)) {
        return obj;
      }
      seen.add(obj);
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(obj)) {
        const lowerKey = key.toLowerCase();
        if (lowerSensitiveKeys.includes(lowerKey)) {
          result[key] = replacement;
        } else {
          result[key] = recurse(obj[key], depth + 1);
        }
      }
      seen.delete(obj);
      return result;
    }

    // Primitives, null, class instances, Dates, RegExps — copy as-is
    return value;
  }

  return recurse(obj, 0);
}