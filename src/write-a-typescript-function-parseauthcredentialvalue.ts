// bloom-deps:

export function parseAuthCredential(value: unknown): { scheme: string; credentials: string } {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  if (value.trim() === "") {
    throw new SyntaxError("Authorization header must not be empty");
  }

  const spaceIndex = value.indexOf(" ");

  if (spaceIndex === -1) {
    throw new SyntaxError("Authorization header must contain a scheme and credentials");
  }

  const scheme = value.slice(0, spaceIndex);
  const credentialsPart = value.slice(spaceIndex + 1);

  if (scheme === "" || !/^[A-Za-z0-9]+$/.test(scheme)) {
    throw new SyntaxError("Invalid scheme");
  }

  const credentials = credentialsPart.trim();

  if (credentials === "") {
    throw new SyntaxError("Credentials must not be empty");
  }

  return { scheme: scheme.toLowerCase(), credentials };
}