// bloom-deps:

export function pickKeysV4(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  if (!obj) {
    return {};
  }

  if (!keys || keys.length === 0) {
    return {};
  }

  const result: Record<string, unknown> = {};

  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}