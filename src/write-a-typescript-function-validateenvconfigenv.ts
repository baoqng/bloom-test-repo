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
    let resolved: string | undefined;
    if (typeof envValue === 'string' && envValue !== '') {
      resolved = envValue;
    } else if (rule.default !== undefined) {
      resolved = rule.default;
    } else {
      resolved = undefined;
    }

    // Step 2: Required check
    if (rule.required === true && resolved === undefined) {
      errors.push({ key, message: `${key} is required` });
      continue;
    }

    if (resolved === undefined) {
      // No value, no required error — just skip
      continue;
    }

    // Track whether this key has errors
    let hasError = false;

    // Step 3: Pattern check
    if (rule.pattern !== undefined && !rule.pattern.test(resolved)) {
      errors.push({ key, message: `${key} does not match required pattern` });
      hasError = true;
    }

    // Step 4: Allowed values check
    if (rule.allowedValues !== undefined && !rule.allowedValues.includes(resolved)) {
      errors.push({ key, message: `${key} must be one of: ${rule.allowedValues.join(', ')}` });
      hasError = true;
    }

    // Populate config only if no errors
    if (!hasError) {
      config[key] = resolved;
    }
  }

  return { config, errors };
}