// bloom-deps:

export function validateContentLanguage(header: unknown): string[] {
  if (typeof header !== "string") {
    throw new TypeError("header must be a string");
  }

  if (!header.trim()) {
    throw new RangeError("header must not be empty");
  }

  const trimmed = header.trim();
  const rawTokens = trimmed.split(",").map((t) => t.trim());

  if (rawTokens.every((t) => t === "")) {
    throw new RangeError("header must contain at least one language tag");
  }

  for (const token of rawTokens) {
    if (token === "") {
      throw new RangeError("each language tag must be a non-empty string");
    }
  }

  const tagPattern = /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/;

  for (const token of rawTokens) {
    if (!tagPattern.test(token)) {
      throw new RangeError(`invalid language tag: ${token}`);
    }
  }

  const lowerTags = rawTokens.map((t) => t.toLowerCase());
  const seen = new Set<string>();

  for (const tag of lowerTags) {
    if (seen.has(tag)) {
      throw new RangeError("duplicate language tags are not allowed");
    }
    seen.add(tag);
  }

  return lowerTags;
}