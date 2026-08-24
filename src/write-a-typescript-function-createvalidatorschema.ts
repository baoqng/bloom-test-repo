// bloom-deps:

type PropertySchema = {
  type: 'string' | 'number' | 'boolean' | 'array';
  required?: boolean;
  minLength?: number;
  min?: number;
  max?: number;
};

type Schema = {
  type: 'object';
  properties: Record<string, PropertySchema>;
  additionalProperties?: boolean;
};

type ValidationResult = {
  valid: boolean;
  errors: string[];
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function createValidator(schema: Schema): (data: unknown) => ValidationResult {
  if (!isPlainObject(schema)) {
    throw new TypeError('schema must be a plain object');
  }

  if (schema.type !== 'object') {
    throw new TypeError('schema.type must be "object"');
  }

  if (!isPlainObject(schema.properties)) {
    throw new TypeError('schema.properties must be a plain object');
  }

  return function validate(data: unknown): ValidationResult {
    const errors: string[] = [];

    if (!isPlainObject(data)) {
      errors.push('data must be a plain object');
      return { valid: false, errors };
    }

    const properties = schema.properties;

    // Check for additional properties if additionalProperties is false
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(data)) {
        if (!(key in properties)) {
          errors.push(`Additional property "${key}" is not allowed`);
        }
      }
    }

    for (const [propName, propSchema] of Object.entries(properties)) {
      const value = data[propName];
      const isDefined = value !== undefined && value !== null;

      // Check required
      if (propSchema.required && (value === undefined || value === null)) {
        errors.push(`"${propName}" is required`);
        continue;
      }

      // Skip further checks if value is not present and not required
      if (!isDefined) {
        continue;
      }

      // Type check
      switch (propSchema.type) {
        case 'string': {
          if (typeof value !== 'string') {
            errors.push(`"${propName}" must be of type string`);
          } else {
            // minLength constraint
            if (
              propSchema.minLength !== undefined &&
              typeof propSchema.minLength === 'number' &&
              isFinite(propSchema.minLength) &&
              value.length < propSchema.minLength
            ) {
              errors.push(
                `"${propName}" must have a minimum length of ${propSchema.minLength}`
              );
            }
          }
          break;
        }
        case 'number': {
          if (typeof value !== 'number' || !isFinite(value)) {
            errors.push(`"${propName}" must be of type number`);
          } else {
            // min constraint
            if (
              propSchema.min !== undefined &&
              typeof propSchema.min === 'number' &&
              isFinite(propSchema.min) &&
              value < propSchema.min
            ) {
              errors.push(
                `"${propName}" must be >= ${propSchema.min}`
              );
            }
            // max constraint
            if (
              propSchema.max !== undefined &&
              typeof propSchema.max === 'number' &&
              isFinite(propSchema.max) &&
              value > propSchema.max
            ) {
              errors.push(
                `"${propName}" must be <= ${propSchema.max}`
              );
            }
          }
          break;
        }
        case 'boolean': {
          if (typeof value !== 'boolean') {
            errors.push(`"${propName}" must be of type boolean`);
          }
          break;
        }
        case 'array': {
          if (!Array.isArray(value)) {
            errors.push(`"${propName}" must be of type array`);
          }
          break;
        }
        default: {
          errors.push(`"${propName}" has an unsupported type in schema`);
          break;
        }
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };
  };
}