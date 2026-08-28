// bloom-deps:

export function parseColonSeparated(input: unknown): { key: string; value: string } {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  const colonIndex = input.indexOf(':');
  if (colonIndex === -1) {
    throw new SyntaxError('input must contain exactly one colon separator');
  }

  const rawKey = input.slice(0, colonIndex);
  const rawValue = input.slice(colonIndex + 1);

  const trimmedKey = rawKey.trim();
  if (trimmedKey.length === 0) {
    throw new RangeError('key must not be empty');
  }

  const trimmedValue = rawValue.trim();
  if (trimmedValue.length === 0) {
    throw new RangeError('value must not be empty');
  }

  return { key: trimmedKey, value: trimmedValue };
}