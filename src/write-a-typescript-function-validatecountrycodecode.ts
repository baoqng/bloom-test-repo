// bloom-deps:

export function validateCountryCode(code: unknown): string {
  if (typeof code !== 'string') {
    throw new TypeError('code must be a string');
  }

  if (code.trim().length === 0) {
    throw new RangeError('code must not be empty');
  }

  const trimmed = code.trim();

  if (trimmed.length !== 2) {
    throw new RangeError('code must be exactly 2 characters');
  }

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed.charCodeAt(i);
    const isLowercase = char >= 97 && char <= 122;
    const isUppercase = char >= 65 && char <= 90;

    if (!isLowercase && !isUppercase) {
      throw new RangeError('code must contain only ASCII letters');
    }
  }

  return trimmed.toUpperCase();
}