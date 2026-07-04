// bloom-deps:

export function invertMapV2(obj: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === 'string') {
      result[value] = key;
    }
  }
  return result;
}