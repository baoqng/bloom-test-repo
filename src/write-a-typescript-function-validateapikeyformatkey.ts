// bloom-deps:

export function validateApiKeyFormat(
  key: unknown,
  expectedPrefix: unknown
): { prefix: string; body: string } {
  // Type check for key
  if (typeof key !== "string") {
    throw new TypeError("key must be a string");
  }

  // Type check for expectedPrefix
  if (typeof expectedPrefix !== "string") {
    throw new TypeError("expectedPrefix must be a non-empty string");
  }

  // Trim both values
  const trimmedKey = key.trim();
  const trimmedPrefix = expectedPrefix.trim();

  // Check if expectedPrefix is empty after trimming
  if (trimmedPrefix.length === 0) {
    throw new TypeError("expectedPrefix must be a non-empty string");
  }

  // Check if key is empty or whitespace-only after trimming
  if (trimmedKey.length === 0) {
    throw new RangeError("key must not be empty");
  }

  // Check if trimmed key starts with trimmed expectedPrefix followed by '_'
  const expectedPrefixWithSeparator = `${trimmedPrefix}_`;
  if (!trimmedKey.startsWith(expectedPrefixWithSeparator)) {
    throw new RangeError(
      `key must start with '${trimmedPrefix}_'`
    );
  }

  // Extract body as everything after '<expectedPrefix>_'
  const body = trimmedKey.substring(expectedPrefixWithSeparator.length);

  // Check if body is empty
  if (body.length === 0) {
    throw new RangeError("key body must not be empty");
  }

  // Check body length bounds (16 to 256 characters)
  if (body.length < 16 || body.length > 256) {
    throw new RangeError("key body must be between 16 and 256 characters");
  }

  // Check if body contains only base64url characters (A-Z, a-z, 0-9, hyphen, underscore)
  if (!/^[A-Za-z0-9\-_]+$/.test(body)) {
    throw new RangeError("key body must contain only base64url characters");
  }

  return {
    prefix: trimmedPrefix,
    body
  };
}