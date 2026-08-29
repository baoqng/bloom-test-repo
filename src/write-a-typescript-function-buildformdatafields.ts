// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  // Check the direct prototype only
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildFormData(fields: unknown): string {
  if (!isPlainObject(fields)) {
    throw new TypeError('fields must be a plain object');
  }

  const record = fields as Record<string, unknown>;
  const pairs: string[] = [];

  for (const key of Object.keys(record)) {
    const encodedKey = encodeURIComponent(key);
    const value = record[key];

    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const element of value) {
        if (typeof element === 'string' || typeof element === 'number' || typeof element === 'boolean') {
          pairs.push(`${encodedKey}=${encodeURIComponent(String(element))}`);
        } else {
          throw new TypeError(`Unsupported array element type for key ${key}`);
        }
      }
    } else if (typeof value === 'string') {
      pairs.push(`${encodedKey}=${encodeURIComponent(value)}`);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      pairs.push(`${encodedKey}=${encodeURIComponent(String(value))}`);
    } else {
      throw new TypeError(`Unsupported field type for key ${key}`);
    }
  }

  return pairs.join('&');
}