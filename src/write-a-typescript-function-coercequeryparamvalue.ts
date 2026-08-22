// bloom-deps:

function coerceQueryParam(
  value: unknown,
  type: 'string' | 'number' | 'boolean' | 'integer' | 'string[]' | 'number[]',
  options?: { required?: boolean; defaultValue?: unknown }
): unknown {
  const validTypes = ['string', 'number', 'boolean', 'integer', 'string[]', 'number[]'];
  if (!validTypes.includes(type)) {
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

  switch (type) {
    case 'string': {
      return String(value);
    }

    case 'number': {
      const n = parseFloat(String(value));
      if (isNaN(n)) {
        throw new RangeError('expected a number');
      }
      return n;
    }

    case 'integer': {
      const n = parseInt(String(value), 10);
      if (isNaN(n) || !Number.isInteger(n)) {
        throw new RangeError('expected an integer');
      }
      return n;
    }

    case 'boolean': {
      const s = String(value).toLowerCase();
      if (s === 'true' || s === '1') return true;
      if (s === 'false' || s === '0') return false;
      throw new RangeError('expected a boolean');
    }

    case 'string[]': {
      if (Array.isArray(value)) {
        return value.map((el) => String(el));
      }
      return String(value)
        .split(',')
        .map((el) => el.trim());
    }

    case 'number[]': {
      let elements: string[];
      if (Array.isArray(value)) {
        elements = value.map((el) => String(el));
      } else {
        elements = String(value)
          .split(',')
          .map((el) => el.trim());
      }
      return elements.map((el, index) => {
        const n = parseFloat(el);
        if (isNaN(n)) {
          throw new RangeError(`expected a number at index ${index}`);
        }
        return n;
      });
    }

    default: {
      throw new TypeError('type must be a valid coercion type');
    }
  }
}

export { coerceQueryParam };