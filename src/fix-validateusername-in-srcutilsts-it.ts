// bloom-deps:

export function validateUsername(username: unknown): string {
  if (username === null || username === undefined) {
    throw new TypeError('Username must not be null or undefined');
  }

  if (typeof username !== 'string') {
    throw new TypeError('Username must be a string');
  }

  const trimmed = username.trim();

  if (trimmed.length === 0) {
    throw new RangeError('Username must not be empty or whitespace only');
  }

  if (trimmed.length < 3) {
    throw new RangeError('Username must be at least 3 characters long');
  }

  if (trimmed.length > 20) {
    throw new RangeError('Username must be at most 20 characters long');
  }

  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(trimmed)) {
    throw new TypeError(
      'Username must contain only letters, digits, underscores, or hyphens'
    );
  }

  return trimmed;
}