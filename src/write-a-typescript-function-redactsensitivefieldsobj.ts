// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
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
  const replacement = options?.replacement ?? '[REDACTED]';

  let maxDepth: number = Infinity;
  if (options !== undefined && 'maxDepth' in options && options.maxDepth !== undefined) {
    const md = options.maxDepth;
    if (md === Infinity) {
      maxDepth = Infinity;
    } else if (
      typeof md !== 'number' ||
      !isFinite(md) ||
      !Number.isInteger(md) ||
      md < 1
    ) {
      throw new RangeError('maxDepth must be a positive integer');
    } else {
      maxDepth = md;
    }
  }

  // Build lowercase set of sensitive keys for case-insensitive matching
  const sensitiveSet = new Set(sensitiveKeys.map((k) => k.toLowerCase()));

  function recurse(value: unknown, depth: number): unknown {
    // At maxDepth, copy as-is without recursing
    if (depth >= maxDepth) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => recurse(item, depth + 1));
    }

    if (isPlainObject(value)) {
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(value)) {
        if (sensitiveSet.has(key.toLowerCase())) {
          result[key] = replacement;
        } else {
          result[key] = recurse(value[key], depth + 1);
        }
      }
      return result;
    }

    // Primitives, null, class instances, Dates, RegExps — copy as-is
    return value;
  }

  return recurse(obj, 0);
}