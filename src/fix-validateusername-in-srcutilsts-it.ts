// bloom-deps:

export function validateUsername(username: unknown): string {
  if (username === null || username === undefined) {
    throw new TypeError('username is required');
  }

  if (typeof username !== 'string') {
    throw new TypeError('username must be a string');
  }

  const trimmed = username.trim();

  if (trimmed === '') {
    throw new TypeError('username cannot be empty');
  }

  if (trimmed.length < 3) {
    throw new RangeError('username must be at least 3 characters');
  }

  if (trimmed.length > 20) {
    throw new RangeError('username cannot exceed 20 characters');
  }

  if (/[^a-zA-Z0-9_-]/.test(trimmed)) {
    throw new TypeError('username can only contain letters, numbers, underscores, and hyphens');
  }

  return trimmed;
}