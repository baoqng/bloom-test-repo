// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  if (proto === Object.prototype) return true;
  // Walk the full prototype chain
  let p = proto;
  while (p !== null) {
    if (p === Object.prototype) {
      // Check if it's a direct Object.prototype child
      if (Object.getPrototypeOf(proto) === null) return true;
      break;
    }
    p = Object.getPrototypeOf(p);
  }
  return proto === Object.prototype;
}

export function buildMetricLabels(labels: unknown): string {
  if (!isPlainObject(labels)) {
    throw new TypeError('labels must be a plain object');
  }

  const keys = Object.keys(labels);

  if (keys.length === 0) {
    return '';
  }

  for (const key of keys) {
    if (key === '') {
      throw new TypeError('Label keys must be non-empty strings');
    }
    const value = labels[key];
    if (typeof value !== 'string') {
      throw new TypeError('Label values must be strings');
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
      throw new SyntaxError(`Invalid label key: ${key}`);
    }
  }

  const sortedKeys = [...keys].sort();

  const parts = sortedKeys.map((key) => {
    const raw = labels[key] as string;
    const escaped = raw.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `${key}="${escaped}"`;
  });

  return `{${parts.join(',')}}`;
}