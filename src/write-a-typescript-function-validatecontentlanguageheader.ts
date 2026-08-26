// bloom-deps:

const LANGUAGE_TAG_REGEX = /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/;

export function validateContentLanguage(header: unknown): string[] {
  if (typeof header !== "string") {
    throw new TypeError("header must be a string");
  }

  if (!header.trim()) {
    throw new RangeError("header must not be empty");
  }

  const trimmed = header.trim();
  const tokens = trimmed.split(",").map((token) => token.trim());

  if (tokens.length === 0 || tokens.every((t) => t === "")) {
    throw new RangeError("header must contain at least one language tag");
  }

  for (const token of tokens) {
    if (token === "") {
      throw new RangeError("each language tag must be a non-empty string");
    }
  }

  for (const token of tokens) {
    if (!LANGUAGE_TAG_REGEX.test(token)) {
      throw new RangeError(`invalid language tag: ${token}`);
    }
  }

  const seen = new Set<string>();
  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (seen.has(lower)) {
      throw new RangeError("duplicate language tags are not allowed");
    }
    seen.add(lower);
  }

  return tokens.map((token) => token.toLowerCase());
}