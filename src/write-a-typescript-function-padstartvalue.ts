// bloom-deps:

function padStart(value: unknown, length: unknown, char?: string): string {
  // Validate value can be converted to string
  if (value === null || value === undefined) {
    throw new TypeError('value must not be null or undefined');
  }
  if (
    typeof value !== 'string' &&
    typeof value !== 'number' &&
    typeof value !== 'boolean' &&
    typeof value !== 'bigint'
  ) {
    throw new TypeError('value must be a type that can be converted to string');
  }

  // Validate length
  if (length === null || length === undefined) {
    throw new TypeError('length must not be null or undefined');
  }
  if (typeof length !== 'number') {
    throw new TypeError('length must be a number');
  }
  if (!isFinite(length)) {
    throw new TypeError('length must be a finite number');
  }
  if (!Number.isInteger(length)) {
    throw new TypeError('length must be an integer');
  }
  if (length < 0) {
    throw new TypeError('length must be a non-negative integer');
  }

  // Validate char if provided
  if (char !== undefined) {
    if (typeof char !== 'string' || char.length === 0) {
      throw new TypeError('char must be a non-empty string');
    }
    if (char.length !== 1) {
      throw new TypeError('char must be a single character');
    }
  }

  const str = String(value);
  const padChar = char !== undefined ? char : ' ';

  if (str.length >= length) {
    return str;
  }

  const padLength = length - str.length;
  const padding = padChar.repeat(padLength);

  return padding + str;
}

export { padStart };