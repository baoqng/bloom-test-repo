// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) {
      // Check that Object.prototype is the direct prototype (plain object)
      return Object.getPrototypeOf(value) === Object.prototype;
    }
    proto = Object.getPrototypeOf(proto);
  }
  // No prototype at all (Object.create(null))
  return Object.getPrototypeOf(value) === null;
}

export function buildMetricTags(tags: unknown): string[] {
  if (!isPlainObject(tags)) {
    throw new TypeError('tags must be a plain object');
  }

  const obj = tags as Record<string, unknown>;
  const result: string[] = [];

  for (const key of Object.keys(obj)) {
    // Validate key type and emptiness
    if (typeof key !== 'string' || key.length === 0) {
      throw new TypeError('each key must be a non-empty string');
    }

    // Validate key is non-empty after trimming
    if (key.trim().length === 0) {
      throw new RangeError('key is empty after trimming');
    }

    // Validate key does not contain colon or whitespace
    if (/[:\s]/.test(key)) {
      throw new RangeError('key must not contain a colon or whitespace character');
    }

    const value = obj[key];

    // Validate value type
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
      throw new TypeError('each value must be a string, number, or boolean');
    }

    // Validate finite number
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new RangeError('numeric values must be finite');
    }

    let strValue: string;
    if (typeof value === 'boolean') {
      strValue = value ? 'true' : 'false';
    } else {
      strValue = String(value);
    }

    result.push(`${key}:${strValue}`);
  }

  result.sort((a, b) => {
    const keyA = a.indexOf(':') !== -1 ? a.slice(0, a.indexOf(':')) : a;
    const keyB = b.indexOf(':') !== -1 ? b.slice(0, b.indexOf(':')) : b;
    return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
  });

  return result;
}