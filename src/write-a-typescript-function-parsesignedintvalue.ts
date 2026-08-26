// bloom-deps:

function parseSignedInt(value: unknown): number {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  if (value.trim() === '') {
    throw new SyntaxError('Input must not be empty');
  }

  let sign = 1;
  let rest = value;

  if (rest[0] === '+' || rest[0] === '-') {
    if (rest[0] === '-') {
      sign = -1;
    }
    rest = rest.slice(1);
  }

  if (rest.length === 0 || !/^\d+$/.test(rest)) {
    throw new SyntaxError('Input must contain only digits after sign');
  }

  if (rest.length > 1 && rest[0] === '0') {
    throw new SyntaxError('Input must not have leading zeros');
  }

  const absValue = parseInt(rest, 10);

  if (absValue > Number.MAX_SAFE_INTEGER) {
    throw new RangeError('Value exceeds safe integer range');
  }

  return sign * absValue;
}

export { parseSignedInt };