// bloom-deps:

function validateTokenFormat(token: unknown): string {
  if (typeof token !== "string") {
    throw new TypeError("token must be a string");
  }

  if (token.length < 32 || token.length > 256) {
    throw new RangeError("token must be between 32 and 256 characters");
  }

  if (!/^[A-Za-z0-9_-]+$/.test(token)) {
    throw new SyntaxError("token contains invalid characters");
  }

  if (token[0] === "-" || token[0] === "_") {
    throw new SyntaxError("token must not start with a hyphen or underscore");
  }

  return token;
}

export { validateTokenFormat };