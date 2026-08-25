// bloom-deps:

function validateConfigKeys(config: unknown, schema: unknown): Record<string, string | number | boolean> {
  if (config === null || typeof config !== 'object' || Array.isArray(config)) {
    throw new TypeError('config must be a plain object');
  }

  if (schema === null || typeof schema !== 'object' || Array.isArray(schema)) {
    throw new TypeError('schema must be a plain object');
  }

  const configObj = config as Record<string, unknown>;
  const schemaObj = schema as Record<string, string>;

  for (const key of Object.keys(schemaObj)) {
    const expectedType = schemaObj[key];

    if (!(key in configObj)) {
      throw new TypeError(`Missing required key: ${key}`);
    }

    if (typeof configObj[key] !== expectedType) {
      throw new TypeError(`${key} must be of type ${expectedType}`);
    }
  }

  return configObj as Record<string, string | number | boolean>;
}

export { validateConfigKeys };