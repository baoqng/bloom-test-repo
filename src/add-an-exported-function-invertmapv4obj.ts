// bloom-deps:

export function invertMapV4(obj: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  
  const keys = Object.keys(obj);
  
  for (const key of keys) {
    const value = obj[key];
    
    if (typeof value === 'string') {
      result[value] = key;
    }
  }
  
  return result;
}