// bloom-deps:

export function validateUsernameFormat(username: unknown): string {
  // Type check
  if (typeof username !== "string") {
    throw new TypeError("username must be a string");
  }

  // Empty/whitespace check
  if (!username.trim()) {
    throw new RangeError("username must not be empty");
  }

  // Trim once before all further checks
  const trimmed = username.trim();

  // Length bounds check
  if (trimmed.length < 3 || trimmed.length > 30) {
    throw new RangeError("username must be between 3 and 30 characters");
  }

  // Character set check
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    throw new RangeError(
      "username must contain only letters, digits, underscores, and hyphens"
    );
  }

  // Start character check
  if (!/^[a-zA-Z0-9]/.test(trimmed)) {
    throw new RangeError("username must start with a letter or digit");
  }

  // End character check
  if (!/[a-zA-Z0-9]$/.test(trimmed)) {
    throw new RangeError("username must end with a letter or digit");
  }

  // Consecutive separators check
  if (/--|-_|__|_-/.test(trimmed)) {
    throw new RangeError(
      "username must not contain consecutive hyphens or underscores"
    );
  }

  return trimmed;
}