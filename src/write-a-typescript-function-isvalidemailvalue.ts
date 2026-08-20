// bloom-deps:

export function isValidEmail(value: unknown): boolean {
  // Validate that value is a non-empty string
  if (typeof value !== 'string' || value.length === 0) {
    return false;
  }

  // Trim and re-validate to reject whitespace-only strings
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return false;
  }

  // Split on @ delimiter
  const parts = trimmed.split('@');

  // Must have exactly one @ symbol (results in exactly 2 parts)
  if (parts.length !== 2) {
    return false;
  }

  const [local, domain] = parts;

  // Both local and domain parts must be non-empty strings
  if (typeof local !== 'string' || local.length === 0) {
    return false;
  }

  if (typeof domain !== 'string' || domain.length === 0) {
    return false;
  }

  // Both parts are non-empty, so it's a valid email pattern
  return true;
}