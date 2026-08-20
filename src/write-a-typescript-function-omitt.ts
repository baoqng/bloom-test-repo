// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  if (!isPlainObject(obj)) {
    throw new TypeError('obj must be a plain object');
  }

  const result = { ...obj } as Omit<T, K>;
  
  for (const key of keys) {
    delete result[key];
  }
  
  return result;
}

export { omit };