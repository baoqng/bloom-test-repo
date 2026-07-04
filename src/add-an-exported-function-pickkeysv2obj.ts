// bloom-deps:

export function pickKeysV2(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  if (obj === null || obj === undefined) {
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