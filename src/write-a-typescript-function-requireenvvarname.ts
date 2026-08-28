// bloom-deps:

export function requireEnvVar(name: unknown): string {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('name must be a non-empty string');
  }

  const value = process.env[name];

  if (value === undefined) {
    throw new RangeError(`Environment variable '${name}' is not set`);
  }

  if (value === '') {
    throw new RangeError(`Environment variable '${name}' is set but empty`);
  }

  return value;
}