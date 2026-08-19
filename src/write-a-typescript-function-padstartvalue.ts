// bloom-deps:

function padStart(value: unknown, length: unknown, char?: string): string {
  // Validate value can be converted to string
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'number' && isNaN(value)) ||
    typeof value === 'symbol' ||
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null)
  ) {
    throw new TypeError('value must be convertible to a string');
  }

  // Validate length is a non-negative integer
  if (
    typeof length !== 'number' ||
    isNaN(length) ||
    !Number.isInteger(length) ||
    length < 0
  ) {
    throw new TypeError('length must be a non-negative integer');
  }

  // Validate char if provided
  if (char !== undefined) {
    if (typeof char !== 'string' || char.length === 0 || char.trim().length === 0) {
      throw new TypeError('char must be a non-empty string');
    }
    if ([...char].length !== 1) {
      throw new TypeError('char must be a single character');
    }
  }

  const str = String(value);
  const padChar = char !== undefined ? char : ' ';

  if (str.length >= length) {
    return str;
  }

  const padLength = length - str.length;
  let padding = '';
  for (let i = 0; i < padLength; i++) {
    padding += padChar;
  }

  return padding + str;
}

export { padStart };