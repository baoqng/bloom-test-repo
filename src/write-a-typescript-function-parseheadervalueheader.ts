// bloom-deps:

function parseHeaderValue(header: unknown, directive: string): string | null {
  // Validate header parameter
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  // Validate directive parameter
  if (typeof directive !== 'string' || directive.length === 0) {
    throw new TypeError('directive must be a non-empty string');
  }

  // Split header on semicolons
  const segments = header.split(';');

  // Look for matching directive (case-insensitive)
  const directiveLower = directive.toLowerCase();

  for (const segment of segments) {
    const trimmed = segment.trim();

    // Check if segment contains '='
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex === -1) {
      // Bare directive with no '=' is not a match
      continue;
    }

    // Extract the key part (before '=')
    const key = trimmed.slice(0, equalIndex).trim().toLowerCase();

    // Check if this is our directive
    if (key === directiveLower) {
      // Extract the value part (after '=')
      let value = trimmed.slice(equalIndex + 1).trim();

      // Strip surrounding double-quotes if present
      if (value.length >= 2 && value[0] === '"' && value[value.length - 1] === '"') {
        value = value.slice(1, -1);
      }

      return value;
    }
  }

  // No matching directive found
  return null;
}

export { parseHeaderValue };