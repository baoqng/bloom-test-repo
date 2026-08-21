// bloom-deps:

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false;
  let proto = v;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(v) === proto;
}

function serializeValue(value: unknown): string {
  if (value instanceof Date) {
    return encodeURIComponent(value.toISOString());
  }
  if (typeof value === 'boolean') {
    return encodeURIComponent(String(value));
  }
  if (typeof value === 'number') {
    return encodeURIComponent(String(value));
  }
  return encodeURIComponent(String(value));
}

function flattenObject(
  obj: Record<string, unknown>,
  prefix: string,
  pairs: Array<{ key: string; value: unknown }>
): void {
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    const val = obj[k];
    if (isPlainObject(val)) {
      flattenObject(val as Record<string, unknown>, fullKey, pairs);
    } else {
      pairs.push({ key: fullKey, value: val });
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

  // First, flatten the object (handling nested plain objects with dot notation)
  const pairs: Array<{ key: string; value: unknown }> = [];
  flattenObject(params as Record<string, unknown>, '', pairs);

  const parts: string[] = [];

  for (const { key, value } of pairs) {
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

        let arrayKey: string;
        if (arrayFormat === 'repeat') {
          arrayKey = encodedKey;
        } else if (arrayFormat === 'bracket') {
          arrayKey = `${encodedKey}%5B%5D`;
        } else {
          // index
          arrayKey = `${encodedKey}%5B${i}%5D`;
        }

        parts.push(`${arrayKey}=${serializeValue(item)}`);
      }
    } else {
      if (value === null && skipNull) continue;
      if (value === undefined && skipUndefined) continue;

      parts.push(`${encodedKey}=${serializeValue(value)}`);
    }
  }

  return parts.join('&');
}