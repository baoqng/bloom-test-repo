// bloom-deps:

function loadConfig(keys: string[]): Record<string, string> {
  if (!Array.isArray(keys)) {
    throw new TypeError('keys must be an Array');
  }

  for (const key of keys) {
    if (typeof key !== 'string' || key.length === 0) {
      throw new TypeError('Each key must be a non-empty string');
    }
  }

  const result: Record<string, string> = {};

  for (const key of keys) {
    const value = process.env[key];
    if (value === undefined || value === '') {
      throw new Error(`Missing or empty environment variable: ${key}`);
    }
    result[key] = value;
  }

  return result;
}

export { loadConfig };