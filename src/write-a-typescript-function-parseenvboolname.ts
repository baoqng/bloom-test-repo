// bloom-deps:

function parseEnvBool(name: string, defaultValue: boolean): boolean {
  if (typeof name !== "string" || name === "") {
    throw new TypeError("name must be a non-empty string");
  }
  if (typeof defaultValue !== "boolean") {
    throw new TypeError("defaultValue must be a boolean");
  }

  const raw = process.env[name];

  if (raw === undefined || raw === "") {
    return defaultValue;
  }

  const lower = raw.toLowerCase();

  if (lower === "true" || lower === "1" || lower === "yes" || lower === "on") {
    return true;
  }

  if (lower === "false" || lower === "0" || lower === "no" || lower === "off") {
    return false;
  }

  throw new RangeError(
    `Environment variable "${name}" has unrecognized value: "${raw}"`
  );
}

export { parseEnvBool };