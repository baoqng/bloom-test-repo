// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  if (!isPlainObject(target)) {
    throw new TypeError(
      'target must be a plain object (not null, array, or class instance)'
    );
  }
  if (!isPlainObject(source)) {
    throw new TypeError(
      'source must be a plain object (not null, array, or class instance)'
    );
  }

  const result: Record<string, unknown> = {};

  const targetRecord = target as Record<string, unknown>;
  const sourceRecord = source as Record<string, unknown>;

  const allKeys = new Set([
    ...Object.keys(targetRecord),
    ...Object.keys(sourceRecord),
  ]);

  for (const key of allKeys) {
    const hasInTarget = Object.prototype.hasOwnProperty.call(targetRecord, key);
    const hasInSource = Object.prototype.hasOwnProperty.call(sourceRecord, key);

    const targetVal = hasInTarget ? targetRecord[key] : undefined;
    const sourceVal = hasInSource ? sourceRecord[key] : undefined;

    if (!hasInSource) {
      // Key only in target: deep-copy if plain object, otherwise assign as-is
      if (isPlainObject(targetVal)) {
        result[key] = deepMerge(targetVal, {});
      } else if (Array.isArray(targetVal)) {
        result[key] = [...targetVal];
      } else {
        result[key] = targetVal;
      }
    } else if (!hasInTarget) {
      // Key only in source: deep-copy if plain object, otherwise assign as-is
      if (isPlainObject(sourceVal)) {
        result[key] = deepMerge(sourceVal, {});
      } else if (Array.isArray(sourceVal)) {
        result[key] = [...sourceVal];
      } else {
        result[key] = sourceVal;
      }
    } else {
      // Key in both
      if (Array.isArray(targetVal) && Array.isArray(sourceVal)) {
        // Concatenate arrays
        result[key] = [...targetVal, ...sourceVal];
      } else if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
        // Recursive merge
        result[key] = deepMerge(targetVal, sourceVal);
      } else {
        // Source primitive overrides target primitive
        result[key] = sourceVal;
      }
    }
  }

  return result as T;
}