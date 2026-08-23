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
    const envValue = (env as Record<string, string | undefined>)[key];

    // Step 1: Resolve value
    let resolved: string | undefined;
    if (typeof envValue === 'string' && envValue.length > 0) {
      resolved = envValue;
    } else if (rule.default !== undefined) {
      resolved = rule.default;
    } else {
      resolved = undefined;
    }

    // Step 2: Required check
    const keyErrors: Array<{ key: string; message: string }> = [];

    if (rule.required === true && resolved === undefined) {
      keyErrors.push({ key, message: `${key} is required` });
    }

    // Step 3: Pattern check
    if (resolved !== undefined && rule.pattern !== undefined) {
      if (!rule.pattern.test(resolved)) {
        keyErrors.push({ key, message: `${key} does not match required pattern` });
      }
    }

    // Step 4: Allowed values check
    if (resolved !== undefined && rule.allowedValues !== undefined) {
      if (!rule.allowedValues.includes(resolved)) {
        keyErrors.push({ key, message: `${key} must be one of: ${rule.allowedValues.join(', ')}` });
      }
    }

    if (keyErrors.length > 0) {
      for (const e of keyErrors) {
        errors.push(e);
      }
      // Exclude from config
    } else if (resolved !== undefined) {
      config[key] = resolved;
    }
  }

  return { config, errors };
}