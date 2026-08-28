// bloom-deps:

export function resolveEnvConfig(name: unknown, defaultValue: unknown): string {
  // Validate name parameter
  if (typeof name !== 'string') {
    throw new TypeError('name must be a non-empty string');
  }

  if (name.length === 0) {
    throw new TypeError('name must be a non-empty string');
  }

  // Validate defaultValue parameter
  if (typeof defaultValue !== 'string') {
    throw new TypeError('defaultValue must be a string');
  }

  // Check if environment variable exists
  if (name in process.env) {
    const envValue = process.env[name];

    // If it exists but is empty, throw RangeError
    if (envValue === '') {
      throw new RangeError(`Environment variable '${name}' is set but empty`);
    }

    // Return the non-empty environment variable value
    return envValue;
  }

  // Variable is absent, return default value
  return defaultValue;
}