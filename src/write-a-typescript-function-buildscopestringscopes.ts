// bloom-deps:

export function buildScopeString(scopes: unknown): string {
  if (!Array.isArray(scopes)) {
    throw new TypeError("scopes must be an array");
  }

  if (scopes.length === 0) {
    throw new RangeError("scopes must not be empty");
  }

  const trimmed: string[] = [];

  for (const scope of scopes) {
    if (typeof scope !== "string" || scope.trim() === "") {
      throw new TypeError("each scope must be a non-empty string");
    }

    const t = scope.trim();

    if (!/^[a-zA-Z0-9:.]+$/.test(t)) {
      throw new RangeError("each scope must contain only letters, digits, colons, and dots");
    }

    trimmed.push(t);
  }

  const unique = [...new Set(trimmed)];
  unique.sort();

  return unique.join(" ");
}