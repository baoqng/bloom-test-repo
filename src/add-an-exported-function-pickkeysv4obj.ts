// bloom-deps:

export function pickKeysV4(
  obj: Record<string, unknown>,
  keys: string[]
): Record<string, unknown> {
  if (!obj || typeof obj !== "object") {
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

    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}