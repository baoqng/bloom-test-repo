// bloom-deps:

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false;
  return Object.getPrototypeOf(v) === Object.prototype;
}

export function validateEnvConfig(
  env: Record<string, string | undefined>,
  schema: Record<string, {
    required?: boolean;
    default?: string;
    pattern?: RegExp;
    allowedValues?: string[];
    description?: string;
  }>
): { config: Record<string, string>; errors: Array<{ key: string; message: string }> } {
  if (!isPlainObject(env)) {
    throw new TypeError('env must be a plain object');
  }
  if (!isPlainObject(schema)) {
    throw new TypeError('schema must be a plain object');
  }

  const config: Record<string, string> = {};
  const errors: Array<{ key: string; message: string }> = [];

  for (const key of Object.keys(schema)) {
    const rule = schema[key];
    const envValue = env[key];

    // Step 1: Resolve value
    let resolvedValue: string | undefined;
    if (typeof envValue === 'string' && envValue.length > 0) {
      resolvedValue = envValue;
    } else if (rule.default !== undefined) {
      resolvedValue = rule.default;
    } else {
      resolvedValue = undefined;
    }

    // Step 2: Required check
    const keyErrors: Array<{ key: string; message: string }> = [];

    if (rule.required === true && resolvedValue === undefined) {
      keyErrors.push({ key, message: `${key} is required` });
    }

    // Step 3: Pattern check
    if (resolvedValue !== undefined && rule.pattern !== undefined) {
      if (!rule.pattern.test(resolvedValue)) {
        keyErrors.push({ key, message: `${key} does not match required pattern` });
      }
    }

    // Step 4: Allowed values check
    if (resolvedValue !== undefined && rule.allowedValues !== undefined) {
      if (!rule.allowedValues.includes(resolvedValue)) {
        keyErrors.push({ key, message: `${key} must be one of: ${rule.allowedValues.join(', ')}` });
      }
    }

    if (keyErrors.length > 0) {
      for (const err of keyErrors) {
        errors.push(err);
      }
      // Exclude from config if there were errors
    } else if (resolvedValue !== undefined) {
      // Only include if resolved and no errors
      config[key] = resolvedValue;
    }
  }

  return { config, errors };
}