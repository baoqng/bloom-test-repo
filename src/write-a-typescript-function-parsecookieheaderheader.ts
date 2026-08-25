// bloom-deps:

function parseCookieHeader(header: unknown): Map<string, string> {
  // Validate input type
  if (typeof header !== "string") {
    throw new TypeError("Cookie header must be a string");
  }

  // Handle empty string
  if (header === "") {
    return new Map();
  }

  const cookieMap = new Map<string, string>();

  // Split by "; " (semicolon followed by single space)
  const pairs = header.split("; ");

  for (const pair of pairs) {
    // Skip pairs that don't contain "="
    if (!pair.includes("=")) {
      continue;
    }

    // Split on first "=" only
    const equalsIndex = pair.indexOf("=");
    const name = pair.substring(0, equalsIndex).trim();
    const value = pair.substring(equalsIndex + 1).trim();

    // Skip pairs whose name is empty after trimming
    if (name === "") {
      continue;
    }

    // For duplicate names, last occurrence wins
    cookieMap.set(name, value);
  }

  return cookieMap;
}

export { parseCookieHeader };