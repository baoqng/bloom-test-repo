// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === null;
}

export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result: Record<string, unknown> = {};

  const targetRecord = target as Record<string, unknown>;
  const sourceRecord = source as Record<string, unknown>;

  const allKeys = new Set([
    ...Object.keys(targetRecord),
    ...Object.keys(sourceRecord),
  ]);

  for (const key of allKeys) {
    const targetValue = targetRecord[key];
    const sourceValue = sourceRecord[key];

    if (!(key in sourceRecord)) {
      result[key] = isPlainObject(targetValue)
        ? deepMerge(targetValue as object, {} as Partial<object>)
        : Array.isArray(targetValue)
        ? [...targetValue]
        : targetValue;
    } else if (!(key in targetRecord)) {
      result[key] = isPlainObject(sourceValue)
        ? deepMerge({} as object, sourceValue as Partial<object>)
        : Array.isArray(sourceValue)
        ? [...sourceValue]
        : sourceValue;
    } else if (Array.isArray(sourceValue)) {
      result[key] = [...sourceValue];
    } else if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      result[key] = deepMerge(
        targetValue as object,
        sourceValue as Partial<object>
      );
    } else {
      result[key] = sourceValue;
    }
  }

  return result as T;
}