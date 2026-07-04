export function invertMapV3(obj: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = Object.create(null);
  
  const keys = Object.keys(obj);
  
  for (const key of keys) {
    const value = obj[key];
    
    if (typeof value === 'string') {
      result[value] = key;
    }
  }
  
  return result;
}