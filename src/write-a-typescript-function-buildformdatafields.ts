// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  
  let proto = Object.getPrototypeOf(value);
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  
  return Object.getPrototypeOf(value) === proto;
}

function buildFormData(fields: unknown): string {
  if (!isPlainObject(fields)) {
    throw new TypeError('fields must be a plain object');
  }

  const pairs: string[] = [];
  const fieldsObj = fields as Record<string, unknown>;

  for (const key in fieldsObj) {
    if (!Object.prototype.hasOwnProperty.call(fieldsObj, key)) {
      continue;
    }

    const value = fieldsObj[key];

    if (value === null || value === undefined) {
      continue;
    }

    const encodedKey = encodeURIComponent(key);

    if (typeof value === 'string') {
      pairs.push(`${encodedKey}=${encodeURIComponent(value)}`);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      pairs.push(`${encodedKey}=${encodeURIComponent(String(value))}`);
    } else if (Array.isArray(value)) {
      for (const element of value) {
        if (typeof element === 'string' || typeof element === 'number' || typeof element === 'boolean') {
          pairs.push(`${encodedKey}=${encodeURIComponent(String(element))}`);
        } else {
          throw new TypeError(`Unsupported array element type for key ${key}`);
        }
      }
    } else {
      throw new TypeError(`Unsupported field type for key ${key}`);
    }
  }

  return pairs.join('&');
}

export { buildFormData };