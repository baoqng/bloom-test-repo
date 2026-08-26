// bloom-deps:

export function validateEnvironmentName(env: unknown): 'development' | 'staging' | 'production' | 'test' {
  if (typeof env !== 'string') {
    throw new TypeError('env must be a string');
  }

  if (env.trim() === '') {
    throw new RangeError('env must not be empty');
  }

  const normalized = env.trim().toLowerCase();

  const validEnvironments = ['development', 'staging', 'production', 'test'] as const;

  if (!validEnvironments.includes(normalized as typeof validEnvironments[number])) {
    throw new RangeError(`unknown environment: ${normalized}`);
  }

  return normalized as 'development' | 'staging' | 'production' | 'test';
}