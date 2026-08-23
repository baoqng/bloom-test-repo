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

  // Handle undefined or null values
  if (value === undefined || value === null) {
    if (options?.required === true) {
      throw new RangeError('parameter is required');
    }
    if (options?.defaultValue !== undefined) {
      return options.defaultValue;
    }
    return undefined;
  }

  // Type coercion logic
  switch (type) {
    case 'string': {
      return String(value);
    }

    case 'number': {
      const num = parseFloat(String(value));
      if (isNaN(num) || !isFinite(num)) {
        throw new RangeError('expected a number');
      }
      return num;
    }

    case 'integer': {
      const num = parseInt(String(value), 10);
      if (isNaN(num) || !Number.isInteger(num)) {
        throw new RangeError('expected an integer');
      }
      return num;
    }

    case 'boolean': {
      const str = String(value).toLowerCase();
      if (str === 'true' || str === '1') {
        return true;
      }
      if (str === 'false' || str === '0') {
        return false;
      }
      throw new RangeError('expected a boolean');
    }

    case 'string[]': {
      if (Array.isArray(value)) {
        return value.map((elem) => String(elem));
      }
      const str = String(value);
      return str.split(',').map((elem) => elem.trim());
    }

    case 'number[]': {
      let elements: unknown[];
      if (Array.isArray(value)) {
        elements = value;
      } else {
        const str = String(value);
        elements = str.split(',').map((elem) => elem.trim());
      }

      const result: number[] = [];
      for (let i = 0; i < elements.length; i++) {
        const num = parseFloat(String(elements[i]));
        if (isNaN(num) || !isFinite(num)) {
          throw new RangeError(`expected a number at index ${i}`);
        }
        result.push(num);
      }
      return result;
    }

    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}