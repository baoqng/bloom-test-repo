function deepClone<T>(value: T, seen: WeakSet<object> = new WeakSet()): T {
  if (value === null || value === undefined) {
    return value;
  }

  const type = typeof value;

  if (type === 'string' || type === 'number' || type === 'boolean') {
    return value;
  }

  if (type === 'function') {
    throw new TypeError('deepClone does not support functions');
  }

  if (type === 'object') {
    if (value instanceof Date) {
      throw new TypeError('deepClone does not support Date objects');
    }

    if (value instanceof RegExp) {
      throw new TypeError('deepClone does not support RegExp objects');
    }

    if (value instanceof Map) {
      throw new TypeError('deepClone does not support Map objects');
    }

    if (value instanceof Set) {
      throw new TypeError('deepClone does not support Set objects');
    }

    if (seen.has(value as object)) {
      throw new TypeError('deepClone does not support circular references');
    }

    seen.add(value as object);

    if (Array.isArray(value)) {
      const clonedArray: unknown[] = [];
      for (let i = 0; i < value.length; i++) {
        clonedArray[i] = deepClone(value[i], seen);
      }
      seen.delete(value as object);
      return clonedArray as unknown as T;
    }

    const isPlainObject = (obj: unknown): obj is Record<string, unknown> => {
      if (typeof obj !== 'object' || obj === null) return false;
      const proto = Object.getPrototypeOf(obj);
      if (proto === Object.prototype || proto === null) return true;
      // Walk the prototype chain to check if it ultimately derives from Object.prototype
      let p = proto;
      while (p !== null) {
        if (p === Object.prototype) return true;
        p = Object.getPrototypeOf(p);
      }
      return false;
    };

    if (isPlainObject(value)) {
      const clonedObj: Record<string, unknown> = {};
      for (const key of Object.keys(value as Record<string, unknown>)) {
        clonedObj[key] = deepClone((value as Record<string, unknown>)[key], seen);
      }
      seen.delete(value as object);
      return clonedObj as unknown as T;
    }

    throw new TypeError(`deepClone does not support objects of type: ${Object.prototype.toString.call(value)}`);
  }

  throw new TypeError(`deepClone does not support values of type: ${type}`);
}

export { deepClone };