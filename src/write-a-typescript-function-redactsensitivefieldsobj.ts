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

  // Validate options
  const replacement = options?.replacement !== undefined ? options.replacement : '[REDACTED]';

  let maxDepth: number = Infinity;
  if (options !== undefined && options.maxDepth !== undefined) {
    const md = options.maxDepth;
    if (md !== Infinity) {
      if (!Number.isInteger(md) || md <= 0) {
        throw new RangeError('maxDepth must be a positive integer');
      }
      maxDepth = md;
    }
  }

  const lowerSensitiveKeys = sensitiveKeys.map((k) => k.toLowerCase());

  function recurse(value: unknown, depth: number): unknown {
    // At maxDepth, copy as-is
    if (depth > maxDepth) {
      return value;
    }

    if (Array.isArray(value)) {
      if (depth === maxDepth) {
        return value;
      }
      return value.map((item) => recurse(item, depth + 1));
    }

    if (isPlainObject(value)) {
      if (depth === maxDepth) {
        return value;
      }
      const result: Record<string, unknown> = {};
      const record = value as Record<string, unknown>;
      for (const key of Object.keys(record)) {
        if (lowerSensitiveKeys.includes(key.toLowerCase())) {
          result[key] = replacement;
        } else {
          result[key] = recurse(record[key], depth + 1);
        }
      }
      return result;
    }

    // Primitives, null, class instances, Dates, RegExps — copy as-is
    return value;
  }

  return recurse(obj, 1);
}