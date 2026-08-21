// bloom-deps:

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

function isArrayValue(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

export function resolveNestedPath(obj: unknown, path: unknown, defaultValue?: unknown): unknown {
  if (!isPlainObject(obj) && !isArrayValue(obj)) {
    throw new TypeError('obj must be a plain object or array');
  }

  if (typeof path !== 'string' || path.length === 0) {
    throw new TypeError('path must be a non-empty string');
  }

  const normalized = path.replace(/\[/g, '.').replace(/\]/g, '');
  const segments = normalized.split('.').filter(segment => segment.length > 0);

  let current: unknown = obj;

  for (const segment of segments) {
    if (current === null || current === undefined) {
      return defaultValue;
    }

    if (isArrayValue(current)) {
      if (/^\d+$/.test(segment)) {
        const index = Number(segment);
        const result = current[index];
        current = result;
      } else {
        return defaultValue;
      }
    } else if (isPlainObject(current)) {
      const result = current[segment];
      current = result;
    } else {
      return defaultValue;
    }
  }

  if (current === undefined) {
    return defaultValue;
  }

  return current;
}