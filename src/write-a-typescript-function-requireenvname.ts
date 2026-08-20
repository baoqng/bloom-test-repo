// bloom-deps:

function requireEnv(name: string): string {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('Expected non-empty string');
  }

  const value = process.env[name];

  if (value === undefined || value === '') {
    throw new ReferenceError(`Missing required environment variable: ${name}`);
  }

  return value;
}

export { requireEnv };