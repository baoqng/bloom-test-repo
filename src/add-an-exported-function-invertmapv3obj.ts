// bloom-deps:

export function invertMapV3(obj: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};

  const keys = Object.keys(obj);
  
  if (!keys || keys.length === 0) {
    return result;
  }

  for (const key of keys) {
    const value = obj[key];
    
    if (value === null || value === undefined) {
      continue;
    }

    result[value] = key;
  }

  return result;
}