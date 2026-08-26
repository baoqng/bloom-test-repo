// bloom-deps:

export function parseSingleCsvField(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  if (value.startsWith('"')) {
    // Quoted field
    if (!value.endsWith('"') || value.length < 2) {
      throw new SyntaxError("Quoted field is not properly closed");
    }

    // Extract inner content (strip surrounding quotes)
    const inner = value.slice(1, value.length - 1);

    // Parse the inner content, handling "" escape sequences
    let result = "";
    let i = 0;
    while (i < inner.length) {
      if (inner[i] === '"') {
        // Must be followed by another double-quote to be valid
        if (i + 1 < inner.length && inner[i + 1] === '"') {
          result += '"';
          i += 2;
        } else {
          throw new SyntaxError("Invalid escape in quoted field");
        }
      } else {
        result += inner[i];
        i++;
      }
    }

    return result;
  } else {
    // Unquoted field — return as-is
    return value;
  }
}