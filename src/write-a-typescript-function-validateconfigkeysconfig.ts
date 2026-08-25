// bloom-deps:

function validateConfigKeys(config: unknown, schema: unknown): Record<string, string | number | boolean> {
  // Validate config
  if (config === null || typeof config !== 'object' || Array.isArray(config)) {
    throw new TypeError('config must be a plain object');
  }

  // Validate schema
  if (schema === null || typeof schema !== 'object' || Array.isArray(schema)) {
    throw new TypeError('schema must be a plain object');
  }

  // Type assertion for schema to allow key iteration
  const schemaObj = schema as Record<string, unknown>;

  // Check each key in schema
  for (const key in schemaObj) {
    if (Object.prototype.hasOwnProperty.call(schemaObj, key)) {
      const expectedType = schemaObj[key];

      // Check if key is present in config
      if (!(key in config)) {
        throw new TypeError(`Missing required key: ${key}`);
      }

      // Check if value type matches expected type
      const configObj = config as Record<string, unknown>;
      const actualType = typeof configObj[key];

      if (actualType !== expectedType) {
        throw new TypeError(`${key} must be of type ${expectedType}`);
      }
    }
  }

  // Return config cast to the required type
  return config as Record<string, string | number | boolean>;
}

export { validateConfigKeys };