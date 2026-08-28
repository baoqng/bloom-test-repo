// bloom-deps:

export function validateConstraintSpec(spec: unknown): Record<string, number> {
  if (typeof spec !== 'string') {
    throw new TypeError('spec must be a string');
  }

  if (spec.trim().length === 0) {
    throw new RangeError('spec must not be empty');
  }

  const result: Record<string, number> = {};
  const tokens = spec.split(',');

  for (const rawToken of tokens) {
    const token = rawToken.trim();

    if (token.length === 0) {
      continue;
    }

    const colonIndex = token.indexOf(':');

    if (colonIndex === -1) {
      throw new RangeError('constraint must be in key:value format');
    }

    const key = token.slice(0, colonIndex).trim();
    const valueStr = token.slice(colonIndex + 1).trim();

    if (key.length === 0 || valueStr.length === 0) {
      throw new RangeError('constraint must be in key:value format');
    }

    if (!/^[a-z_]+$/.test(key)) {
      throw new RangeError('constraint key contains invalid characters');
    }

    const numValue = Number(valueStr);
    if (!isFinite(numValue) || isNaN(numValue) || valueStr.trim() === '') {
      throw new RangeError('constraint value must be a number');
    }

    if (Object.prototype.hasOwnProperty.call(result, key)) {
      throw new RangeError(`duplicate constraint key: ${key}`);
    }

    result[key] = numValue;
  }

  return result;
}