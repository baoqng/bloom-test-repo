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

    // Step 1: Resolve value
    let value: string | undefined;
    const envVal = (env as Record<string, string | undefined>)[key];
    if (typeof envVal === 'string' && envVal !== '') {
      value = envVal;
    } else if (rule.default !== undefined) {
      value = rule.default;
    } else {
      value = undefined;
    }

    // Track per-key errors to decide whether to include in config
    const keyErrors: Array<{ key: string; message: string }> = [];

    // Step 2: Required check
    if (rule.required === true && value === undefined) {
      keyErrors.push({ key, message: `${key} is required` });
    }

    // Step 3: Pattern check
    if (value !== undefined && rule.pattern !== undefined) {
      if (!rule.pattern.test(value)) {
        keyErrors.push({ key, message: `${key} does not match required pattern` });
      }
    }

    // Step 4: Allowed values check
    if (value !== undefined && rule.allowedValues !== undefined) {
      if (!rule.allowedValues.includes(value)) {
        keyErrors.push({ key, message: `${key} must be one of: ${rule.allowedValues.join(', ')}` });
      }
    }

    if (keyErrors.length > 0) {
      for (const e of keyErrors) {
        errors.push(e);
      }
    } else if (value !== undefined) {
      config[key] = value;
    }
  }

  return { config, errors };
}