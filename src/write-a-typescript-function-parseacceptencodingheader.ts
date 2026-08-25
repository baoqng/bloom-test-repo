// bloom-deps:

export function parseAcceptEncoding(
  header: unknown
): Array<{ encoding: string; q: number }> {
  // Type guard: must be a string
  if (typeof header !== "string") {
    throw new TypeError("header must be a string");
  }

  // Empty string returns empty array
  if (header === "") {
    return [];
  }

  const entries = header.split(",");
  const parsed: Array<{ encoding: string; q: number }> = [];

  for (const entry of entries) {
    const trimmedEntry = entry.trim();

    // Skip empty entries (e.g., from consecutive commas)
    if (trimmedEntry === "") {
      throw new SyntaxError(`Invalid encoding token: ''`);
    }

    const parts = trimmedEntry.split(";");
    const encodingToken = parts[0].trim();

    // Validate encoding token: non-empty and only [a-zA-Z0-9*-]
    if (encodingToken === "") {
      throw new SyntaxError(`Invalid encoding token: '${encodingToken}'`);
    }

    const tokenRegex = /^[a-zA-Z0-9*-]+$/;
    if (!tokenRegex.test(encodingToken)) {
      throw new SyntaxError(`Invalid encoding token: '${encodingToken}'`);
    }

    let q = 1.0;

    // Parse parameters (if any)
    for (let i = 1; i < parts.length; i++) {
      const param = parts[i].trim();

      // Look for q=N format
      if (param.toLowerCase().startsWith("q=")) {
        const qValueRaw = param.substring(2).trim();

        // Parse as float
        const qValue = parseFloat(qValueRaw);

        // Check if parsing succeeded and value is in [0, 1]
        if (isNaN(qValue) || qValue < 0 || qValue > 1) {
          throw new SyntaxError(`Invalid q-value: '${qValueRaw}'`);
        }

        q = qValue;
      }
      // Ignore unrecognized parameters
    }

    parsed.push({ encoding: encodingToken, q });
  }

  // Sort by q descending (stable sort preserves original order for equal q)
  parsed.sort((a, b) => b.q - a.q);

  return parsed;
}