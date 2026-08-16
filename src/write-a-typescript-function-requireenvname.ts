function requireEnv(name: string): string {
  if (typeof name !== 'string' || name.length === 0 || /^\s+$/.test(name) || name.includes('\x00')) {
    throw new TypeError('name must be a non-empty string');
  }

  const value = process.env[name];

  if (value === undefined || value === null || /^\s+$/.test(value) || value.length === 0) {
    throw new Error(`Environment variable "${name}" is missing or empty`);
  }

  return value;
}

export { requireEnv };