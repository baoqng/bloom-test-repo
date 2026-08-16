// bloom-deps:

export function requireEnv(name: string): string {
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new TypeError('name must be a non-empty string');
  }

  const val = process.env[name];

  if (val === undefined || val === '') {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return val;
}