// bloom-deps:

export function parseGrantType(value: unknown): 'authorization_code' | 'client_credentials' | 'refresh_token' | 'password' {
  if (typeof value !== 'string') {
    throw new TypeError('grant_type must be a string');
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new RangeError('grant_type must not be empty');
  }

  const allowed = ['authorization_code', 'client_credentials', 'refresh_token', 'password'] as const;

  for (const allowed_value of allowed) {
    if (trimmed === allowed_value) {
      return trimmed as 'authorization_code' | 'client_credentials' | 'refresh_token' | 'password';
    }
  }

  throw new RangeError(`unsupported grant_type: ${trimmed}`);
}