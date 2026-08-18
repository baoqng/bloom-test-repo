// bloom-deps:

function requireEnv(name: string): string {
  if (typeof name !== 'string' || name === '') {
    throw new TypeError('name must be a non-empty string');
  }

  const value = process.env[name];

  if (value === undefined || value === null || value === '') {
    throw new Error(`Environment variable "${name}" is missing or empty`);
  }

  return value;
}

export { requireEnv };