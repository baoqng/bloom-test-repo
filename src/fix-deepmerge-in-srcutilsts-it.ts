// bloom-deps:

export function deepMerge(target: unknown, source: unknown): Record<string, unknown> {
  if (target === null || target === undefined) {
    throw new TypeError('target is required');
  }
  if (typeof target !== 'object' || Array.isArray(target)) {
    throw new TypeError('target must be a plain object');
  }
  if (source === null || source === undefined) {
    throw new TypeError('source is required');
  }
  if (typeof source !== 'object' || Array.isArray(source)) {
    throw new TypeError('source must be a plain object');
  }

  const targetObj = target as Record<string, unknown>;
  const sourceObj = source as Record<string, unknown>;

  for (const key of Object.keys(sourceObj)) {
    const targetVal = targetObj[key];
    const sourceVal = sourceObj[key];

    if (
      targetVal !== null &&
      targetVal !== undefined &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal) &&
      sourceVal !== null &&
      sourceVal !== undefined &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal)
    ) {
      targetObj[key] = deepMerge(targetVal, sourceVal);
    } else {
      targetObj[key] = sourceVal;
    }
  }

  return targetObj;
}