// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

export function deepMergeObjects(target: unknown, source: unknown): Record<string, unknown> {
  if (!isPlainObject(target)) {
    throw new TypeError("target must be a plain object");
  }
  if (!isPlainObject(source)) {
    throw new TypeError("source must be a plain object");
  }

  const result: Record<string, unknown> = {};

  // Copy all keys from target first
  for (const key of Object.keys(target)) {
    result[key] = target[key];
  }

  // Merge keys from source
  for (const key of Object.keys(source)) {
    const targetVal = target[key];
    const sourceVal = source[key];

    if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
      result[key] = deepMergeObjects(targetVal, sourceVal);
    } else {
      result[key] = sourceVal;
    }
  }

  return result;
}