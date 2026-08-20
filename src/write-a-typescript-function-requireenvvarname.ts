// bloom-deps:

export function requireEnvVar(name: string): string {
  if (typeof name !== 'string' || name === '') {
    throw new TypeError('name must be a non-empty string');
  }

  const value = process.env[name];

  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}