// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function parseEnvBool(name: string, defaultValue: boolean): boolean {
  // Validate name parameter
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('name must be a non-empty string');
  }

  // Validate defaultValue parameter
  if (typeof defaultValue !== 'boolean') {
    throw new TypeError('defaultValue must be a boolean');
  }

  // Get environment variable value
  const envValue = process.env[name];

  // If unset or empty, return defaultValue
  if (envValue === undefined || envValue === '') {
    return defaultValue;
  }

  // Normalize to lowercase for case-insensitive comparison
  const normalizedValue = envValue.toLowerCase();

  // Check for accepted true values
  if (normalizedValue === 'true' || normalizedValue === '1' || normalizedValue === 'yes' || normalizedValue === 'on') {
    return true;
  }

  // Check for accepted false values
  if (normalizedValue === 'false' || normalizedValue === '0' || normalizedValue === 'no' || normalizedValue === 'off') {
    return false;
  }

  // If we reach here, the value is non-empty but not recognized
  throw new RangeError(`Invalid boolean value for environment variable "${name}": "${envValue}"`);
}

export { parseEnvBool, ServiceError };