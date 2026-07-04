// bloom-deps:

export function invertMapV6(obj: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  
  const keys = Object.keys(obj);
  
  for (const key of keys) {
    const value = obj[key];
    
    if (value !== null && value !== undefined) {
      result[value] = key;
    }
  }
  
  return result;
}