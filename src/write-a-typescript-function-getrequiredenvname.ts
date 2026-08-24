// bloom-deps:

export function getRequiredEnv(name: string): string {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError(
      `Environment variable name must be a non-empty string, received: ${JSON.stringify(name)}`
    );
  }

  const value = process.env[name];

  if (value === undefined || value === '') {
    throw new Error(
      `Required environment variable "${name}" is not set or is empty`
    );
  }

  return value;
}