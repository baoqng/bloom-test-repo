// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype;
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

  const replacement = options?.replacement ?? '[REDACTED]';
  const maxDepth = options?.maxDepth ?? Infinity;

  // Validate maxDepth if provided
  if (maxDepth !== Infinity) {
    if (!Number.isInteger(maxDepth) || maxDepth <= 0) {
      throw new RangeError('maxDepth must be a positive integer');
    }
  }

  const sensitiveKeysLower = sensitiveKeys.map((k) => k.toLowerCase());

  function recurse(value: unknown, depth: number): unknown {
    // At maxDepth, copy as-is without recursing
    if (depth > maxDepth) {
      return value;
    }

    if (Array.isArray(value)) {
      if (depth === maxDepth) {
        return value;
      }
      return value.map((element) => recurse(element, depth + 1));
    }

    if (isPlainObject(value)) {
      if (depth === maxDepth) {
        return value;
      }
      const cloned: Record<string, unknown> = {};
      for (const key of Object.keys(value)) {
        if (sensitiveKeysLower.includes(key.toLowerCase())) {
          cloned[key] = replacement;
        } else {
          cloned[key] = recurse(value[key], depth + 1);
        }
      }
      return cloned;
    }

    // Primitives, null, class instances, Dates, RegExps — copy as-is
    return value;
  }

  return recurse(obj, 1);
}