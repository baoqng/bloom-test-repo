// bloom-deps:

function buildCacheKey(namespace: unknown, parts: unknown): string {
  if (typeof namespace !== "string" || namespace.trim().length === 0) {
    throw new TypeError("namespace must be a non-empty string");
  }

  const trimmedNamespace = namespace.trim();

  if (!/^[a-zA-Z0-9\-_]+$/.test(trimmedNamespace)) {
    throw new RangeError("namespace must contain only letters, digits, hyphens, and underscores");
  }

  if (!Array.isArray(parts) || parts.length === 0) {
    throw new TypeError("parts must be a non-empty array");
  }

  for (const part of parts) {
    if (typeof part !== "string" && typeof part !== "number") {
      throw new TypeError("each part must be a string or number");
    }
    if (typeof part === "string" && part.trim().length === 0) {
      throw new RangeError("each part must not be empty");
    }
    if (typeof part === "number" && (!isFinite(part) || isNaN(part))) {
      throw new RangeError("each part must not be empty");
    }
  }

  const convertedParts = parts.map((part) => {
    if (typeof part === "string") {
      return part.trim();
    }
    return String(part);
  });

  return `${trimmedNamespace}:${convertedParts.join(":")}`;
}

export { buildCacheKey };