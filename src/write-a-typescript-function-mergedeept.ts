// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  // Object.create(null) case
  if (Object.getPrototypeOf(value) === null) return true;
  return false;
}

function isPlainObjectStrict(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function deepClone(value: unknown): unknown {
  if (!isPlainObjectStrict(value)) {
    return value;
  }
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    result[key] = deepClone(value[key]);
  }
  return result;
}

function mergeDeepInternal(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  seen: WeakSet<object>
): Record<string, unknown> {
  const result: Record<string, unknown> = Object.assign({}, target);

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (isPlainObjectStrict(sourceValue)) {
      if (seen.has(sourceValue)) {
        result[key] = sourceValue;
      } else {
        seen.add(sourceValue);
        if (isPlainObjectStrict(targetValue)) {
          result[key] = mergeDeepInternal(
            targetValue,
            sourceValue,
            seen
          );
        } else {
          result[key] = mergeDeepInternal({}, sourceValue, seen);
        }
        seen.delete(sourceValue);
      }
    } else {
      result[key] = sourceValue;
    }
  }

  return result;
}

export function mergeDeep<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!isPlainObjectStrict(target)) {
    throw new TypeError('target must be a plain object');
  }

  const seen = new WeakSet<object>();
  seen.add(target);

  let result: Record<string, unknown> = deepClone(target) as Record<string, unknown>;

  if (sources.length === 0) {
    return result as unknown as T;
  }

  for (const source of sources) {
    if (source === null || source === undefined) {
      continue;
    }
    if (!isPlainObjectStrict(source)) {
      continue;
    }
    seen.add(source);
    result = mergeDeepInternal(result, source as unknown as Record<string, unknown>, seen);
    seen.delete(source);
  }

  return result as unknown as T;
}