// bloom-deps:

function requireEnv(name: string): string {
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new TypeError(`name must be a non-empty string, got: ${JSON.stringify(name)}`);
  }
  const val = process.env[name];
  if (val === undefined || val === null || val === '') {
    throw new Error(`Missing or empty env var: ${name}`);
  }
  return val;
}

export { requireEnv };