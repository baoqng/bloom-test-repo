// bloom-deps:

export function parseGrantType(value: unknown): 'authorization_code' | 'client_credentials' | 'refresh_token' | 'password' {
  if (typeof value !== 'string') {
    throw new TypeError('grant_type must be a string');
  }

  if (!value.trim()) {
    throw new RangeError('grant_type must not be empty');
  }

  const trimmed = value.trim();

  const allowed = ['authorization_code', 'client_credentials', 'refresh_token', 'password'] as const;

  if (!(allowed as readonly string[]).includes(trimmed)) {
    throw new RangeError(`unsupported grant_type: ${trimmed}`);
  }

  return trimmed as 'authorization_code' | 'client_credentials' | 'refresh_token' | 'password';
}