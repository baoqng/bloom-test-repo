// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildJsonMergePatch(source: unknown, target: unknown): Record<string, unknown> {
  if (!isPlainObject(source)) {
    throw new TypeError('source must be a plain object');
  }
  if (!isPlainObject(target)) {
    throw new TypeError('target must be a plain object');
  }

  const patch: Record<string, unknown> = {};

  // Keys in source but absent in target -> set to null (deletion)
  for (const key of Object.keys(source)) {
    if (!Object.prototype.hasOwnProperty.call(target, key)) {
      patch[key] = null;
    }
  }

  // Keys in target
  for (const key of Object.keys(target)) {
    const targetValue = target[key];
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      // Key in target only -> include with target value
      patch[key] = targetValue;
    } else {
      const sourceValue = source[key];
      // Both present: compare values
      if (typeof sourceValue === 'object' || typeof targetValue === 'object') {
        // For object/array values, always include with target value (no recursion)
        patch[key] = targetValue;
      } else if (sourceValue !== targetValue) {
        // Different primitive values -> include with target value
        patch[key] = targetValue;
      }
      // Identical primitive values -> omit
    }
  }

  return patch;
}