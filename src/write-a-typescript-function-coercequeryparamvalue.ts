// bloom-deps:

export type CoercionType = 'string' | 'number' | 'boolean' | 'integer' | 'string[]' | 'number[]';

interface CoerceQueryParamOptions {
  required?: boolean;
  defaultValue?: unknown;
}

export function coerceQueryParam(
  value: unknown,
  type: CoercionType,
  options?: CoerceQueryParamOptions
): unknown {
  // Validate type argument
  const validTypes: CoercionType[] = ['string', 'number', 'boolean', 'integer', 'string[]', 'number[]'];
  if (!validTypes.includes(type)) {
    throw new TypeError('type must be a valid coercion type');
  }

  // Handle null/undefined cases
  if (value === null || value === undefined) {
    if (options?.required === true) {
      throw new RangeError('parameter is required');
    }
    if (options?.defaultValue !== undefined) {
      return options.defaultValue;
    }
    return undefined;
  }

  // Coerce based on type
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
      const int = parseInt(String(value), 10);
      if (isNaN(int) || !Number.isInteger(int)) {
        throw new RangeError('expected an integer');
      }
      return int;
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
        return value.map((elem: unknown) => String(elem));
      }
      const str = String(value);
      return str.split(',').map((elem: string) => elem.trim());
    }

    case 'number[]': {
      let elements: unknown[] = [];
      if (Array.isArray(value)) {
        elements = value;
      } else {
        const str = String(value);
        elements = str.split(',').map((elem: string) => elem.trim());
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