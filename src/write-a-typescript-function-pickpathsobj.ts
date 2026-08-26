// bloom-deps:

function pickPaths(obj: unknown, paths: unknown): Record<string, unknown> {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    throw new TypeError("obj must be a plain object");
  }

  if (!Array.isArray(paths)) {
    throw new TypeError("paths must be an array");
  }

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    if (typeof path !== "string" || path.length === 0) {
      throw new TypeError(`Path at index ${i} must be a non-empty string`);
    }
  }

  const result: Record<string, unknown> = {};

  for (const path of paths as string[]) {
    const segments = path.split(".");
    let current: unknown = obj;

    let success = true;
    for (let s = 0; s < segments.length; s++) {
      const segment = segments[s];
      if (current === null || typeof current !== "object" || Array.isArray(current)) {
        success = false;
        break;
      }
      const currentObj = current as Record<string, unknown>;
      if (!Object.prototype.hasOwnProperty.call(currentObj, segment)) {
        success = false;
        break;
      }
      current = currentObj[segment];
      if (s < segments.length - 1) {
        if (current === null || typeof current !== "object" || Array.isArray(current)) {
          success = false;
          break;
        }
      }
    }

    if (success) {
      result[path] = current;
    }
  }

  return result;
}

export { pickPaths };