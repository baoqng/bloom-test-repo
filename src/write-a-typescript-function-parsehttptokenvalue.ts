// bloom-deps:

export function parseHttpToken(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  if (value.length === 0) {
    throw new SyntaxError("Token must not be empty");
  }

  // RFC 7230 token characters: alphanumerics and ! # $ % & ' * + - . ^ _ ` | ~
  const validTokenRegex = /^[a-zA-Z0-9!#$%&'*+\-.^_`|~]+$/;

  if (!validTokenRegex.test(value)) {
    throw new SyntaxError("Token contains invalid characters");
  }

  return value;
}