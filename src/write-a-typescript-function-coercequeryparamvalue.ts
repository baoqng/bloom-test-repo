// bloom-deps:

function coerceQueryParam(
  value: unknown,
  type: 'string' | 'number' | 'boolean' | 'integer' | 'string[]' | 'number[]',
  options?: { required?: boolean; defaultValue?: unknown }
): unknown {
  const validTypes = ['string', 'number', 'boolean', 'integer', 'string[]', 'number[]'];
  if (!validTypes.includes(type as string)) {
    throw new TypeError('type must be a valid coercion type');
  }

  if (value === undefined || value === null) {
    if (options?.required === true) {
      throw new RangeError('parameter is required');
    }
    if (options !== undefined && 'defaultValue' in options) {
      return options.defaultValue;
    }
    return undefined;
  }

  if (type === 'string') {
    return String(value);
  }

  if (type === 'number') {
    const parsed = parseFloat(String(value));
    if (isNaN(parsed)) {
      throw new RangeError('expected a number');
    }
    return parsed;
  }

  if (type === 'integer') {
    const str = String(value);
    const parsed = parseInt(str, 10);
    if (isNaN(parsed)) {
      throw new RangeError('expected an integer');
    }
    if (!Number.isInteger(parseFloat(str))) {
      throw new RangeError('expected an integer');
    }
    return parsed;
  }

  if (type === 'boolean') {
    const lower = String(value).toLowerCase();
    if (lower === 'true' || lower === '1') return true;
    if (lower === 'false' || lower === '0') return false;
    throw new RangeError('expected a boolean');
  }

  if (type === 'string[]') {
    if (Array.isArray(value)) {
      return value.map((el) => String(el));
    }
    return String(value)
      .split(',')
      .map((el) => el.trim());
  }

  if (type === 'number[]') {
    let elements: string[];
    if (Array.isArray(value)) {
      elements = value.map((el) => String(el));
    } else {
      elements = String(value)
        .split(',')
        .map((el) => el.trim());
    }
    return elements.map((el, index) => {
      const parsed = parseFloat(el);
      if (isNaN(parsed)) {
        throw new RangeError(`expected a number at index ${index}`);
      }
      return parsed;
    });
  }

  return undefined;
}

export { coerceQueryParam };