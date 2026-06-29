// bloom-deps:

export function mapValues(
  obj: unknown,
  transformFn: unknown
): Record<string, unknown> {
  if (obj === null || obj === undefined) {
    throw new TypeError('obj is required');
  }
  if (transformFn === null || transformFn === undefined) {
    throw new TypeError('transformFn is required');
  }
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    throw new TypeError('obj must be a plain object');
  }
  if (typeof transformFn !== 'function') {
    throw new TypeError('transformFn must be a function');
  }

  const plainObj = obj as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(plainObj)) {
    result[key] = transformFn(plainObj[key], key);
  }

  return result;
}