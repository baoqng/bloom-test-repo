// bloom-deps:

function validateUsernameFormat(username: unknown): string {
  if (typeof username !== "string") {
    throw new TypeError("username must be a string");
  }

  if (username.trim().length === 0) {
    throw new RangeError("username must not be empty");
  }

  const trimmed = username.trim();

  if (trimmed.length < 3 || trimmed.length > 30) {
    throw new RangeError("username must be between 3 and 30 characters");
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    throw new RangeError("username must contain only letters, digits, underscores, and hyphens");
  }

  if (!/^[a-zA-Z0-9]/.test(trimmed)) {
    throw new RangeError("username must start with a letter or digit");
  }

  if (!/[a-zA-Z0-9]$/.test(trimmed)) {
    throw new RangeError("username must end with a letter or digit");
  }

  if (/--|__|_-|-_/.test(trimmed)) {
    throw new RangeError("username must not contain consecutive hyphens or underscores");
  }

  return trimmed;
}

export { validateUsernameFormat };