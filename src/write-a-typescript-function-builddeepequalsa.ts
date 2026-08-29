// bloom-deps:

function buildDeepEquals(a: unknown, b: unknown): boolean {
  const seenLeft = new WeakMap<object, WeakSet<object>>();

  function deepEquals(x: unknown, y: unknown): boolean {
    // Handle NaN
    if (typeof x === 'number' && typeof y === 'number') {
      if (Number.isNaN(x) && Number.isNaN(y)) return true;
      // Handle +0 vs -0
      if (x === 0 && y === 0) {
        return (1 / x) === (1 / y);
      }
      return x === y;
    }

    // Primitives (strict equality)
    if (x === null && y === null) return true;
    if (x === null || y === null) return false;
    if (typeof x !== 'object' && typeof x !== 'function') {
      return x === y;
    }
    if (typeof y !== 'object' && typeof y !== 'function') {
      return x === y;
    }

    // Both are objects at this point
    const xObj = x as object;
    const yObj = y as object;

    // Circular reference check
    if (seenLeft.has(xObj)) {
      const seenRight = seenLeft.get(xObj)!;
      if (seenRight.has(yObj)) {
        // We've seen this pair before — treat as equal (same cycle)
        return true;
      }
    }

    // Record this pair as being visited
    if (!seenLeft.has(xObj)) {
      seenLeft.set(xObj, new WeakSet<object>());
    }
    seenLeft.get(xObj)!.add(yObj);

    try {
      // Array check
      if (Array.isArray(x) && Array.isArray(y)) {
        if (x.length !== y.length) return false;
        for (let i = 0; i < x.length; i++) {
          if (!deepEquals(x[i], y[i])) return false;
        }
        return true;
      }
      if (Array.isArray(x) !== Array.isArray(y)) return false;

      // Date check
      if (x instanceof Date && y instanceof Date) {
        return x.getTime() === y.getTime();
      }
      if (x instanceof Date || y instanceof Date) return false;

      // RegExp check
      if (x instanceof RegExp && y instanceof RegExp) {
        return x.source === y.source && x.flags === y.flags;
      }
      if (x instanceof RegExp || y instanceof RegExp) return false;

      // Plain object check
      if (isPlainObject(x) && isPlainObject(y)) {
        const xKeys = Object.keys(x as Record<string, unknown>);
        const yKeys = Object.keys(y as Record<string, unknown>);
        if (xKeys.length !== yKeys.length) return false;
        const yKeysSet = new Set(yKeys);
        for (const key of xKeys) {
          if (!yKeysSet.has(key)) return false;
          if (!deepEquals(
            (x as Record<string, unknown>)[key],
            (y as Record<string, unknown>)[key]
          )) return false;
        }
        return true;
      }
      if (isPlainObject(x) !== isPlainObject(y)) return false;

      // All other object types: reference equality
      return x === y;
    } finally {
      // Clean up: remove yObj from the seen set for xObj
      // Note: WeakSet doesn't have delete in all envs, but it does in modern JS
      seenLeft.get(xObj)?.delete(yObj);
    }
  }

  return deepEquals(a, b);
}

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;

  // Walk the full prototype chain
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) {
      // Check if Object.prototype is the direct or indirect prototype
      // For plain objects, prototype chain should be: value -> Object.prototype -> null
      const parentProto = Object.getPrototypeOf(proto);
      if (parentProto === null) {
        // proto is Object.prototype; check that value's direct proto is Object.prototype or null
        const directProto = Object.getPrototypeOf(value);
        return directProto === Object.prototype || directProto === null;
      }
      break;
    }
    // If we encounter any constructor other than Object along the way, not plain
    if (proto.constructor && proto.constructor !== Object) {
      return false;
    }
    proto = Object.getPrototypeOf(proto);
  }

  const directProto = Object.getPrototypeOf(value);
  return directProto === Object.prototype || directProto === null;
}

export { buildDeepEquals };