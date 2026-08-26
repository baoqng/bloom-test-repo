// bloom-deps:

function parseEnumString<T extends string>(value: unknown, allowed: unknown): T {
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }

  if (!Array.isArray(allowed) || allowed.length === 0 || !allowed.every((item) => typeof item === 'string')) {
    throw new TypeError('allowed must be a non-empty array of strings');
  }

  if (!allowed.includes(value)) {
    throw new SyntaxError(`Invalid value: '${value}'. Must be one of: ${allowed.join(', ')}`);
  }

  return value as T;
}

export { parseEnumString };