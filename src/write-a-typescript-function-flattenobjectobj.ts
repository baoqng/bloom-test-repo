// bloom-deps:

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

export function flattenObject(
  obj: unknown,
  options?: { separator?: string; prefix?: string; maxDepth?: number }
): Record<string, unknown> {
  // Validate obj
  if (!isPlainObject(obj)) {
    throw new TypeError('obj must be a plain object');
  }

  // Extract and validate options
  const separator = options?.separator !== undefined ? options.separator : '.';
  const prefix = options?.prefix !== undefined ? options.prefix : '';
  const maxDepth = options?.maxDepth !== undefined ? options.maxDepth : Infinity;

  // Validate separator
  if (typeof separator !== 'string' || separator.length === 0) {
    throw new RangeError('separator must be a non-empty string');
  }

  // Validate prefix
  if (typeof prefix !== 'string') {
    throw new TypeError('prefix must be a string');
  }

  // Validate maxDepth
  if (maxDepth !== Infinity) {
    if (!Number.isInteger(maxDepth) || maxDepth < 1) {
      throw new RangeError('maxDepth must be a positive integer');
    }
  }

  const result: Record<string, unknown> = {};

  function traverse(current: unknown, currentPrefix: string, depth: number): void {
    // Determine if current value should be expanded
    const isExpandable = isPlainObject(current) || Array.isArray(current);

    if (!isExpandable) {
      // Leaf value
      if (currentPrefix !== '') {
        result[currentPrefix] = current;
      }
      return;
    }

    // At maxDepth, write as-is
    if (depth >= maxDepth) {
      if (currentPrefix !== '') {
        result[currentPrefix] = current;
      }
      return;
    }

    // Expand the object/array
    const keys = Object.keys(current as object);

    if (keys.length === 0) {
      // Empty object/array produces no keys
      return;
    }

    for (const key of keys) {
      const compoundKey = currentPrefix === '' ? key : currentPrefix + separator + key;
      const val = (current as Record<string, unknown>)[key];
      traverse(val, compoundKey, depth + 1);
    }
  }

  traverse(obj, prefix, 0);

  return result;
}