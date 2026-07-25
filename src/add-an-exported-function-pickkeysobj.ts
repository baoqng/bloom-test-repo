// bloom-deps:

export function pickKeys(
  obj: Record<string, unknown>,
  keys: string[]
): Record<string, unknown> {
  if (obj === null || obj === undefined) {
    return {};
  }

  if (!Array.isArray(keys)) {
    return {};
  }

  const result: Record<string, unknown> = {};

  for (const key of keys) {
    if (typeof key !== "string") {
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }

  return result;
}