// bloom-deps:

function isPlainObject(v: unknown): boolean {
  if (v === null || typeof v !== 'object') return false;
  if (Array.isArray(v)) return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

export function resolveNestedPath(obj: unknown, path: unknown, defaultValue?: unknown): unknown {
  if (!Array.isArray(obj) && !isPlainObject(obj)) {
    throw new TypeError('obj must be a plain object or array');
  }

  if (typeof path !== 'string' || path.length === 0) {
    throw new TypeError('path must be a non-empty string');
  }

  const normalized = path.replace(/\[/g, '.').replace(/\]/g, '');
  const segments = normalized.split('.').filter(s => s.length > 0);

  let current: unknown = obj;

  for (const segment of segments) {
    if (current === null || current === undefined) {
      return defaultValue;
    }

    if (Array.isArray(current)) {
      if (/^\d+$/.test(segment)) {
        const index = parseInt(segment, 10);
        current = current[index];
      } else {
        return defaultValue;
      }
    } else if (isPlainObject(current)) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return defaultValue;
    }
  }

  if (current === undefined) {
    return defaultValue;
  }

  return current;
}