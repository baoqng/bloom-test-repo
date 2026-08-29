// bloom-deps:

export function evaluateJsonPath(doc: unknown, path: unknown): unknown[] {
  // Validate doc
  if (doc === null || doc === undefined) {
    throw new TypeError("doc must be a non-null value");
  }

  // Validate path
  if (typeof path !== "string" || path.length === 0) {
    throw new TypeError("path must be a non-empty string");
  }

  // Validate path starts with '$'
  if (path[0] !== "$") {
    throw new SyntaxError("JSONPath must start with $");
  }

  // Root path
  if (path === "$") {
    return [doc];
  }

  // Parse the remainder after '$'
  const remainder = path.slice(1);

  // Tokenize the path into segments
  const segments: Array<{ type: "key" | "index"; value: string | number }> = [];

  let i = 0;
  while (i < remainder.length) {
    if (remainder[i] === ".") {
      // Dot notation: $.key
      i++; // skip '.'
      if (i >= remainder.length) {
        throw new SyntaxError("Invalid JSONPath expression");
      }
      // Read key until next '.' or '['
      let key = "";
      while (i < remainder.length && remainder[i] !== "." && remainder[i] !== "[") {
        key += remainder[i];
        i++;
      }
      if (key.length === 0) {
        throw new SyntaxError("Invalid JSONPath expression");
      }
      // Validate key: must be valid identifier-like (letters, digits, underscore, dollar)
      if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) {
        throw new SyntaxError("Invalid JSONPath expression");
      }
      segments.push({ type: "key", value: key });
    } else if (remainder[i] === "[") {
      // Bracket notation: [N]
      i++; // skip '['
      // Find closing ']'
      const closeIdx = remainder.indexOf("]", i);
      if (closeIdx === -1) {
        throw new SyntaxError("Invalid JSONPath expression");
      }
      const indexStr = remainder.slice(i, closeIdx);
      i = closeIdx + 1;

      // Validate index is a non-negative integer
      if (!/^\d+$/.test(indexStr)) {
        throw new SyntaxError("Invalid JSONPath expression");
      }
      const index = parseInt(indexStr, 10);
      segments.push({ type: "index", value: index });
    } else {
      // Unsupported syntax
      throw new SyntaxError("Invalid JSONPath expression");
    }
  }

  if (segments.length === 0) {
    throw new SyntaxError("Invalid JSONPath expression");
  }

  // Evaluate segments
  let current: unknown = doc;

  for (const segment of segments) {
    if (segment.type === "key") {
      // Must be a plain object
      if (
        current === null ||
        typeof current !== "object" ||
        Array.isArray(current)
      ) {
        return [];
      }
      const obj = current as Record<string, unknown>;
      if (!Object.prototype.hasOwnProperty.call(obj, segment.value)) {
        return [];
      }
      current = obj[segment.value as string];
    } else if (segment.type === "index") {
      // Must be an array
      if (!Array.isArray(current)) {
        return [];
      }
      const idx = segment.value as number;
      if (idx < 0 || idx >= current.length) {
        return [];
      }
      current = current[idx];
    }
  }

  return [current];
}