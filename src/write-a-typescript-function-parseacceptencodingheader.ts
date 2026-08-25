// bloom-deps:

export function parseAcceptEncoding(
  header: unknown
): Array<{ encoding: string; q: number }> {
  // Type validation: header must be a string
  if (typeof header !== "string") {
    throw new TypeError(`Expected header to be a string, got ${typeof header}`);
  }

  // Empty string returns empty array
  if (header === "") {
    return [];
  }

  const entries: Array<{ encoding: string; q: number }> = [];

  // Split on comma to get individual entries
  const parts = header.split(",");

  for (const part of parts) {
    const trimmedPart = part.trim();

    // Skip empty entries
    if (trimmedPart === "") {
      continue;
    }

    // Split on semicolon to separate encoding token from parameters
    const [encodingPart, ...paramParts] = trimmedPart.split(";");
    const token = encodingPart.trim();

    // Validate encoding token
    if (token === "") {
      throw new SyntaxError(`Invalid encoding token: ''`);
    }

    // Check that token contains only valid characters: [a-zA-Z0-9*-]
    if (!/^[a-zA-Z0-9*-]+$/.test(token)) {
      throw new SyntaxError(`Invalid encoding token: '${token}'`);
    }

    // Default q-value is 1.0
    let qValue = 1.0;

    // Parse parameters
    for (const param of paramParts) {
      const trimmedParam = param.trim();
      if (trimmedParam.startsWith("q=")) {
        const rawQValue = trimmedParam.substring(2).trim();
        const parsed = parseFloat(rawQValue);

        // Validate q-value: must be a valid float and within [0, 1]
        if (isNaN(parsed) || parsed < 0 || parsed > 1) {
          throw new SyntaxError(`Invalid q-value: '${rawQValue}'`);
        }

        qValue = parsed;
      }
      // Ignore unrecognized parameters
    }

    entries.push({ encoding: token, q: qValue });
  }

  // Sort by q descending (stable sort preserves original order for equal q values)
  entries.sort((a, b) => b.q - a.q);

  return entries;
}