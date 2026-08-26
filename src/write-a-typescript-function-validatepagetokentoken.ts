// bloom-deps:

export function validatePageToken(token: unknown): string {
  if (typeof token !== "string") {
    throw new TypeError("token must be a string");
  }

  if (token.trim().length === 0) {
    throw new RangeError("token must not be empty");
  }

  const trimmed = token.trim();

  if (trimmed.length < 8 || trimmed.length > 512) {
    throw new RangeError("token must be between 8 and 512 characters");
  }

  if (!/^[A-Za-z0-9\-_]+$/.test(trimmed)) {
    throw new RangeError("token must contain only base64url characters");
  }

  return trimmed;
}