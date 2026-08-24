// bloom-deps:

export function parseForwardedHeader(header: unknown): {
  for?: string;
  by?: string;
  host?: string;
  proto?: string;
} {
  // Type validation
  if (typeof header !== "string") {
    throw new TypeError(
      `Expected header to be a string, got ${typeof header}`
    );
  }

  // Handle empty or whitespace-only strings
  if (header.trim() === "") {
    return {};
  }

  const result: {
    for?: string;
    by?: string;
    host?: string;
    proto?: string;
  } = {};
  const recognizedKeys = new Set(["for", "by", "host", "proto"]);
  const parsedKeys = new Set<string>();

  // Split by semicolon to get individual tokens
  const tokens = header.split(";");

  for (const token of tokens) {
    const trimmedToken = token.trim();

    // Skip empty tokens
    if (trimmedToken === "") {
      continue;
    }

    // Find the equals sign
    const equalsIndex = trimmedToken.indexOf("=");

    // Skip malformed tokens (missing '=' or empty key)
    if (equalsIndex === -1 || equalsIndex === 0) {
      continue;
    }

    const key = trimmedToken.substring(0, equalsIndex).trim().toLowerCase();
    const value = trimmedToken.substring(equalsIndex + 1).trim();

    // Skip if key is empty
    if (key === "") {
      continue;
    }

    // Skip if value is empty
    if (value === "") {
      continue;
    }

    // Skip unrecognized keys
    if (!recognizedKeys.has(key)) {
      continue;
    }

    // Skip if this key was already parsed (keep first occurrence)
    if (parsedKeys.has(key)) {
      continue;
    }

    // Strip surrounding double quotes if present
    let finalValue = value;
    if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
      finalValue = value.substring(1, value.length - 1);
    }

    // Add to result
    result[key as "for" | "by" | "host" | "proto"] = finalValue;
    parsedKeys.add(key);
  }

  return result;
}