// bloom-deps:

function deepClone<T>(value: T): T {
  const visited = new WeakSet<object>();

  function clone(val: unknown): unknown {
    // Handle null and undefined
    if (val === null || val === undefined) {
      return val;
    }

    // Handle primitives
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      return val;
    }

    // Handle symbols
    if (typeof val === 'symbol') {
      return val;
    }

    // Reject functions
    if (typeof val === 'function') {
      throw new TypeError('Functions are not supported');
    }

    // At this point, val should be an object
    if (typeof val !== 'object') {
      return val;
    }

    // Check for unsupported types
    if (val instanceof Map) {
      throw new TypeError('Map is not supported');
    }
    if (val instanceof Set) {
      throw new TypeError('Set is not supported');
    }
    if (val instanceof Date) {
      throw new TypeError('Date is not supported');
    }
    if (val instanceof RegExp) {
      throw new TypeError('RegExp is not supported');
    }

    // Guard against circular references
    if (visited.has(val)) {
      throw new TypeError('Circular reference detected');
    }
    visited.add(val);

    // Handle arrays
    if (Array.isArray(val)) {
      const clonedArray: unknown[] = [];
      for (let i = 0; i < val.length; i++) {
        clonedArray[i] = clone(val[i]);
      }
      return clonedArray;
    }

    // Handle plain objects
    if (Object.getPrototypeOf(val) === Object.prototype || Object.getPrototypeOf(val) === null) {
      const clonedObj: Record<string, unknown> = {};
      for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key)) {
          clonedObj[key] = clone((val as Record<string, unknown>)[key]);
        }
      }
      return clonedObj;
    }

    // Reject other object types
    throw new TypeError('Unsupported object type');
  }

  return clone(value) as T;
}

export { deepClone };