// bloom-deps:

function evaluateJsonPath(doc: unknown, path: unknown): unknown[] {
  // Validate doc
  if (doc === null || doc === undefined) {
    throw new TypeError("doc must be a non-null value");
  }

  // Validate path
  if (typeof path !== "string" || path.length === 0) {
    throw new TypeError("path must be a non-empty string");
  }

  // Check if path starts with $
  if (!path.startsWith("$")) {
    throw new SyntaxError("JSONPath must start with $");
  }

  // Handle root path
  if (path === "$") {
    return [doc];
  }

  // Parse the path and evaluate
  let current: unknown = doc;
  let remaining = path.slice(1); // Remove the leading $

  while (remaining.length > 0) {
    if (remaining.startsWith(".")) {
      // Property access: $.key
      remaining = remaining.slice(1);

      // Extract the key name - support unicode characters
      const keyMatch = remaining.match(/^[a-zA-Z_$\u0080-\uFFFF][a-zA-Z0-9_$\u0080-\uFFFF]*/);
      if (!keyMatch) {
        throw new SyntaxError("Invalid JSONPath expression");
      }

      const key = keyMatch[0];
      remaining = remaining.slice(key.length);

      // Navigate to the property
      if (
        current !== null &&
        typeof current === "object" &&
        key in current
      ) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return [];
      }
    } else if (remaining.startsWith("[")) {
      // Array index access: $[N]
      const closeIndex = remaining.indexOf("]");
      if (closeIndex === -1) {
        throw new SyntaxError("Invalid JSONPath expression");
      }

      const indexStr = remaining.slice(1, closeIndex);

      // Validate that indexStr is a valid non-negative integer
      if (!/^\d+$/.test(indexStr)) {
        throw new SyntaxError("Invalid JSONPath expression");
      }

      const index = parseInt(indexStr, 10);
      remaining = remaining.slice(closeIndex + 1);

      // Navigate to the array index
      if (Array.isArray(current) && index >= 0 && index < current.length) {
        current = current[index];
      } else {
        return [];
      }
    } else {
      throw new SyntaxError("Invalid JSONPath expression");
    }
  }

  return [current];
}

export { evaluateJsonPath };