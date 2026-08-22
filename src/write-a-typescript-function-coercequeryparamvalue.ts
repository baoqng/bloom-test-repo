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
      const num = parseFloat(String(value));
      if (isNaN(num)) {
        throw new RangeError('expected a number');
      }
      return num;
    }

    case 'integer': {
      const intVal = parseInt(String(value), 10);
      if (isNaN(intVal) || !Number.isInteger(intVal)) {
        throw new RangeError('expected an integer');
      }
      return intVal;
    }

    case 'boolean': {
      const lower = String(value).toLowerCase();
      if (lower === 'true' || lower === '1') return true;
      if (lower === 'false' || lower === '0') return false;
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
        const num = parseFloat(el);
        if (isNaN(num)) {
          throw new RangeError(`expected a number at index ${index}`);
        }
        return num;
      });
    }

    default: {
      throw new TypeError('type must be a valid coercion type');
    }
  }
}

export { coerceQueryParam };