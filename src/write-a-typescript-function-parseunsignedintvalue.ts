// bloom-deps:

function parseUnsignedInt(value: unknown, name: string): number {
  if (typeof value !== 'string') {
    throw new TypeError(`${name} must be a string`);
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new SyntaxError(`${name} must not be empty`);
  }

  if (!/^[0-9]+$/.test(trimmed)) {
    throw new SyntaxError(`${name} must contain only digits`);
  }

  if (trimmed.length > 1 && trimmed[0] === '0') {
    throw new SyntaxError(`${name} must not have leading zeros`);
  }

  return parseInt(trimmed, 10);
}

export { parseUnsignedInt };