// bloom-deps:

export function requireEnv(name: string): string {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError(`name must be a non-empty string`);
  }

  const value = process.env[name];

  if (!value || value === '') {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return value;
}