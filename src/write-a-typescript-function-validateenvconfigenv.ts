// bloom-deps:

function validateEnvConfig(
  env: Record<string, string | undefined>,
  schema: Record<string, {
    required?: boolean;
    default?: string;
    pattern?: RegExp;
    allowedValues?: string[];
    description?: string;
  }>
): { config: Record<string, string>; errors: Array<{ key: string; message: string }> } {
  if (env === null || env === undefined || Object.getPrototypeOf(env) !== Object.prototype) {
    throw new TypeError('env must be a plain object');
  }
  if (schema === null || schema === undefined || Object.getPrototypeOf(schema) !== Object.prototype) {
    throw new TypeError('schema must be a plain object');
  }

  const config: Record<string, string> = {};
  const errors: Array<{ key: string; message: string }> = [];

  for (const key of Object.keys(schema)) {
    const schemaDef = schema[key];
    const envValue = env[key];

    // Resolve value
    let resolvedValue: string | undefined;

    if (typeof envValue === 'string' && envValue.length > 0) {
      resolvedValue = envValue;
    } else if (schemaDef.default !== undefined) {
      resolvedValue = schemaDef.default;
    } else {
      resolvedValue = undefined;
    }

    const keyErrors: Array<{ key: string; message: string }> = [];

    // Check required
    if (schemaDef.required === true && resolvedValue === undefined) {
      keyErrors.push({ key, message: `${key} is required` });
    }

    // Check pattern
    if (resolvedValue !== undefined && schemaDef.pattern !== undefined) {
      if (!schemaDef.pattern.test(resolvedValue)) {
        keyErrors.push({ key, message: `${key} does not match required pattern` });
      }
    }

    // Check allowedValues
    if (resolvedValue !== undefined && schemaDef.allowedValues !== undefined) {
      if (!schemaDef.allowedValues.includes(resolvedValue)) {
        keyErrors.push({ key, message: `${key} must be one of: ${schemaDef.allowedValues.join(', ')}` });
      }
    }

    if (keyErrors.length > 0) {
      for (const err of keyErrors) {
        errors.push(err);
      }
    } else if (resolvedValue !== undefined) {
      config[key] = resolvedValue;
    }
  }

  return { config, errors };
}

export { validateEnvConfig };