// bloom-deps:

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype;
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

  const replacement = options?.replacement ?? '[REDACTED]';

  const maxDepth = options?.maxDepth ?? Infinity;
  if (maxDepth !== Infinity) {
    if (!Number.isInteger(maxDepth) || maxDepth < 1) {
      throw new RangeError('maxDepth must be a positive integer');
    }
  }

  const lowerKeys = sensitiveKeys.map((k) => k.toLowerCase());

  function recurse(value: unknown, depth: number): unknown {
    // At maxDepth, copy as-is
    if (depth > maxDepth) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((elem) => recurse(elem, depth + 1));
    }

    if (isPlainObject(value)) {
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(value)) {
        if (lowerKeys.includes(key.toLowerCase())) {
          result[key] = replacement;
        } else {
          result[key] = recurse(value[key], depth + 1);
        }
      }
      return result;
    }

    // Primitive, null, class instance, Date, RegExp, etc. — copy as-is
    return value;
  }

  // Start at depth 1
  return recurse(obj, 1);
}