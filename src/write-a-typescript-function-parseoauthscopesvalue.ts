// bloom-deps:

function parseOAuthScopes(value: unknown): Set<string> {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  const trimmed = value.trim();

  if (trimmed === "") {
    return new Set<string>();
  }

  const parts = trimmed.split(/ +/);

  const result = new Set<string>();

  for (const scope of parts) {
    if (scope === "") {
      throw new SyntaxError(`Invalid scope: ${scope}`);
    }

    for (let i = 0; i < scope.length; i++) {
      const code = scope.charCodeAt(i);
      // Printable ASCII is 0x21 to 0x7E (excludes space 0x20 and non-printable)
      if (code < 0x21 || code > 0x7e) {
        throw new SyntaxError(`Invalid scope: ${scope}`);
      }
    }

    result.add(scope);
  }

  return result;
}

export { parseOAuthScopes };