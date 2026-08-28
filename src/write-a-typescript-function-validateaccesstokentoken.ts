// bloom-deps:

export function validateAccessToken(token: unknown): { type: string; credential: string } {
  if (typeof token !== "string") {
    throw new TypeError("token must be a string");
  }

  if (token.trim().length === 0) {
    throw new RangeError("token must not be empty");
  }

  const trimmed = token.trim();

  // Count space occurrences explicitly using indexOf
  let spaceCount = 0;
  let idx = -1;
  let spaceIndex = -1;
  while ((idx = trimmed.indexOf(" ", idx + 1)) !== -1) {
    spaceCount++;
    if (spaceCount === 1) {
      spaceIndex = idx;
    }
  }

  if (spaceCount !== 1) {
    throw new RangeError("token must contain exactly one space separator");
  }

  const type = trimmed.slice(0, spaceIndex);
  const credential = trimmed.slice(spaceIndex + 1);

  if (type.length === 0) {
    throw new RangeError("token type must not be empty");
  }

  if (/[^a-zA-Z]/.test(type)) {
    throw new RangeError("token type must contain only letters");
  }

  if (credential.length === 0) {
    throw new RangeError("token credential must not be empty");
  }

  if (credential.length < 8) {
    throw new RangeError("token credential must be at least 8 characters");
  }

  if (/\s/.test(credential)) {
    throw new RangeError("token credential must not contain whitespace");
  }

  return { type: type.toLowerCase(), credential };
}