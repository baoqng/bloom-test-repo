// bloom-deps:

function extractByJsonPath(obj: unknown, path: unknown): unknown {
  // Validate obj
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    throw new TypeError("obj must be a plain object");
  }

  // Validate path
  if (typeof path !== "string" || path.length === 0) {
    throw new TypeError("path must be a non-empty string");
  }

  // Split path on '.'
  const segments = path.split(".");

  // Check for empty segments
  for (const segment of segments) {
    if (segment === "") {
      throw new SyntaxError(`Empty segment in path: '${path}'`);
    }
  }

  // Traverse the object
  let current: unknown = obj;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const isLast = i === segments.length - 1;

    if (isLast) {
      // Return the value at the final segment, or undefined if absent
      return (current as Record<string, unknown>)[segment];
    } else {
      // More segments remain — current must be a traversable object
      const next = (current as Record<string, unknown>)[segment];

      if (next === null || typeof next !== "object" || Array.isArray(next)) {
        throw new RangeError(`Cannot traverse into non-object at '${segment}'`);
      }

      current = next;
    }
  }

  return undefined;
}

export { extractByJsonPath };