// bloom-deps:

function buildScopeString(scopes: unknown): string {
  if (!Array.isArray(scopes)) {
    throw new TypeError("scopes must be an array");
  }

  if (scopes.length === 0) {
    throw new RangeError("scopes must not be empty");
  }

  for (const scope of scopes) {
    if (typeof scope !== "string" || scope.trim() === "") {
      throw new TypeError("each scope must be a non-empty string");
    }
    if (/[^a-zA-Z0-9:.]/.test(scope.trim())) {
      throw new RangeError("each scope must contain only letters, digits, colons, and dots");
    }
  }

  const trimmed = scopes.map((s: string) => s.trim());
  const unique = [...new Set(trimmed)];
  unique.sort();

  return unique.join(" ");
}

export { buildScopeString };