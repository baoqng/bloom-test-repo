// bloom-deps:

export function requireEnv(name: string): string {
  if (typeof name !== 'string' || name.length === 0 || name.trim() === '') {
    throw new TypeError('name must be a non-empty string');
  }

  const val = process.env[name];

  if (val === undefined || val === null || val === '') {
    throw new Error(`Missing or empty env var: ${name}`);
  }

  return val;
}