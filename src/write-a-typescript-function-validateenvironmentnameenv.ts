// bloom-deps:

export function validateEnvironmentName(env: unknown): 'development' | 'staging' | 'production' | 'test' {
  if (typeof env !== 'string') {
    throw new TypeError('env must be a string');
  }

  const trimmed = env.trim();

  if (!trimmed) {
    throw new RangeError('env must not be empty');
  }

  const lowercased = trimmed.toLowerCase();
  const validEnvironments = ['development', 'staging', 'production', 'test'] as const;

  if (!validEnvironments.includes(lowercased as any)) {
    throw new RangeError(`unknown environment: ${lowercased}`);
  }

  return lowercased as 'development' | 'staging' | 'production' | 'test';
}