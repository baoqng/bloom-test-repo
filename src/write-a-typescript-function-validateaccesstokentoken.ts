// bloom-deps:

export function validateAccessToken(token: unknown): { type: string; credential: string } {
  if (typeof token !== "string") {
    throw new TypeError("token must be a string");
  }

  if (token.trim().length === 0) {
    throw new RangeError("token must not be empty");
  }

  const trimmed = token.trim();

  const spaces = trimmed.split(" ").length - 1;
  if (spaces !== 1) {
    throw new RangeError("token must contain exactly one space separator");
  }

  const spaceIndex = trimmed.indexOf(" ");
  const type = trimmed.substring(0, spaceIndex);
  const credential = trimmed.substring(spaceIndex + 1);

  if (type.length === 0) {
    throw new RangeError("token type must not be empty");
  }

  if (!/^[a-zA-Z]+$/.test(type)) {
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