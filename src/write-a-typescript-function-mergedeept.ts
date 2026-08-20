// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  let proto = Object.getPrototypeOf(value);
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(value) === proto;
}

function mergeDeep<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!isPlainObject(target)) {
    throw new TypeError('target must be a plain object');
  }

  if (sources.length === 0) {
    return target;
  }

  const result = { ...target } as T;
  const visited = new WeakSet<object>();

  function merge(tgt: Record<string, unknown>, src: Record<string, unknown>): void {
    if (visited.has(src)) {
      return;
    }
    visited.add(src);

    for (const key in src) {
      if (!Object.prototype.hasOwnProperty.call(src, key)) {
        continue;
      }

      const sourceValue = src[key];
      const targetValue = tgt[key];

      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        tgt[key] = { ...targetValue } as Record<string, unknown>;
        merge(tgt[key] as Record<string, unknown>, sourceValue as Record<string, unknown>);
      } else {
        tgt[key] = sourceValue;
      }
    }
  }

  for (const source of sources) {
    if (source !== null && typeof source === 'object') {
      merge(result, source as Record<string, unknown>);
    }
  }

  return result;
}

export { mergeDeep };