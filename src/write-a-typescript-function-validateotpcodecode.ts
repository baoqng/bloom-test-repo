// bloom-deps:

export function validateOtpCode(code: unknown): string {
  // Type check
  if (typeof code !== 'string') {
    throw new TypeError('code must be a string');
  }

  // Trim the string
  const trimmed = code.trim();

  // Empty or whitespace-only check
  if (trimmed.length === 0) {
    throw new RangeError('code must not be empty');
  }

  // Check for non-digit characters
  if (!/^\d+$/.test(trimmed)) {
    throw new RangeError('code must contain only digits');
  }

  // Check for valid length (6 or 8 digits)
  if (trimmed.length !== 6 && trimmed.length !== 8) {
    throw new RangeError('code must be 6 or 8 digits');
  }

  // Return the trimmed string
  return trimmed;
}