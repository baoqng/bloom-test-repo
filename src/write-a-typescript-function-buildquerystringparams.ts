// bloom-deps:

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false;
  let proto = v;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(v) === proto;
}

function serializeScalar(value: unknown): string {
  if (value instanceof Date) {
    return encodeURIComponent(value.toISOString());
  }
  if (typeof value === 'boolean') {
    return encodeURIComponent(String(value));
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return '';
    }
    return encodeURIComponent(String(value));
  }
  if (value === null) {
    return '';
  }
  if (value === undefined) {
    return '';
  }
  return encodeURIComponent(String(value));
}

function flattenObject(
  obj: Record<string, unknown>,
  prefix: string,
  result: Array<[string, unknown]>
): void {
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (isPlainObject(value)) {
      flattenObject(value, fullKey, result);
    } else {
      result.push([fullKey, value]);
    }
  }
}

export function buildQueryString(
  params: unknown,
  options?: {
    arrayFormat?: 'repeat' | 'bracket' | 'index';
    skipNull?: boolean;
    skipUndefined?: boolean;
  }
): string {
  if (!isPlainObject(params)) {
    throw new TypeError('params must be a plain object');
  }

  const arrayFormat = options?.arrayFormat ?? 'repeat';
  const skipNull = options?.skipNull !== undefined ? options.skipNull : true;
  const skipUndefined = options?.skipUndefined !== undefined ? options.skipUndefined : true;

  // Flatten the object first
  const flatEntries: Array<[string, unknown]> = [];
  flattenObject(params, '', flatEntries);

  const parts: string[] = [];

  for (const [key, value] of flatEntries) {
    const encodedKey = encodeURIComponent(key);

    if (Array.isArray(value)) {
      // Check for arrays of plain objects
      for (const item of value) {
        if (isPlainObject(item)) {
          throw new TypeError('nested arrays of objects are not supported');
        }
      }

      for (let i = 0; i < value.length; i++) {
        const item = value[i];

        if (item === null && skipNull) continue;
        if (item === undefined && skipUndefined) continue;

        let serializedKey: string;
        if (arrayFormat === 'repeat') {
          serializedKey = encodedKey;
        } else if (arrayFormat === 'bracket') {
          serializedKey = `${encodedKey}%5B%5D`;
        } else {
          // index
          serializedKey = `${encodedKey}%5B${i}%5D`;
        }

        parts.push(`${serializedKey}=${serializeScalar(item)}`);
      }
    } else {
      if (value === null && skipNull) continue;
      if (value === undefined && skipUndefined) continue;

      parts.push(`${encodedKey}=${serializeScalar(value)}`);
    }
  }

  return parts.join('&');
}