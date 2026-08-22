// bloom-deps:

export function coerceQueryParam(
  value: unknown,
  type: 'string' | 'number' | 'boolean' | 'integer' | 'string[]' | 'number[]',
  options?: { required?: boolean; defaultValue?: unknown }
): unknown {
  // Validate type parameter
  const validTypes = ['string', 'number', 'boolean', 'integer', 'string[]', 'number[]'];
  if (!validTypes.includes(type)) {
    throw new TypeError('type must be a valid coercion type');
  }

  // Handle null/undefined values
  if (value === null || value === undefined) {
    if (options?.required === true) {
      throw new RangeError('parameter is required');
    }
    if (options?.defaultValue !== undefined) {
      return options.defaultValue;
    }
    return undefined;
  }

  // String coercion
  if (type === 'string') {
    return String(value);
  }

  // Number coercion
  if (type === 'number') {
    const parsed = parseFloat(String(value));
    if (isNaN(parsed) || !isFinite(parsed)) {
      throw new RangeError('expected a number');
    }
    return parsed;
  }

  // Integer coercion
  if (type === 'integer') {
    const parsed = parseInt(String(value), 10);
    if (isNaN(parsed) || !Number.isInteger(parsed)) {
      throw new RangeError('expected an integer');
    }
    return parsed;
  }

  // Boolean coercion
  if (type === 'boolean') {
    const lowercased = String(value).toLowerCase();
    if (lowercased === 'true' || lowercased === '1') {
      return true;
    }
    if (lowercased === 'false' || lowercased === '0') {
      return false;
    }
    throw new RangeError('expected a boolean');
  }

  // String array coercion
  if (type === 'string[]') {
    if (Array.isArray(value)) {
      return (value as unknown[]).map((v) => String(v));
    }
    const stringValue = String(value);
    return stringValue.split(',').map((s) => s.trim());
  }

  // Number array coercion
  if (type === 'number[]') {
    let arrayValue: unknown[] = [];
    if (Array.isArray(value)) {
      arrayValue = value;
    } else {
      const stringValue = String(value);
      arrayValue = stringValue.split(',').map((s) => s.trim());
    }

    const result: number[] = [];
    for (let i = 0; i < arrayValue.length; i++) {
      const parsed = parseFloat(String(arrayValue[i]));
      if (isNaN(parsed) || !isFinite(parsed)) {
        throw new RangeError(`expected a number at index ${i}`);
      }
      result.push(parsed);
    }
    return result;
  }

  return undefined;
}