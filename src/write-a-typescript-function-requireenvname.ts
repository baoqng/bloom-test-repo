// bloom-deps:

export function requireEnv(name: string): string {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError(`'name' must be a non-empty string`);
  }

  const value = process.env[name];

  if (value === undefined || value === null) {
    throw new Error(`Environment variable '${name}' is missing`);
  }

  if (value.length === 0) {
    throw new Error(`Environment variable '${name}' must not be empty`);
  }

  return value;
}