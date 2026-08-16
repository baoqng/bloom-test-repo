// bloom-deps:

function padStart(value: unknown, length: unknown, char?: string): string {
  // Step 1: value validation
  if (value === null || value === undefined || typeof value === 'symbol') {
    throw new TypeError('value must be a string or number');
  }
  const str = String(value);

  // Step 2: length validation
  if (!Number.isInteger(length) || (length as number) < 0) {
    throw new TypeError('length must be a non-negative integer');
  }
  const targetLength = length as number;

  // Step 3: char validation
  let padChar = ' ';
  if (char !== undefined) {
    if (typeof char !== 'string' || char.length !== 1) {
      throw new TypeError('char must be a single character');
    }
    padChar = char;
  }

  // Step 4: padding
  if (str.length >= targetLength) {
    return str;
  }

  const padCount = targetLength - str.length;
  const padding = padChar.repeat(padCount);
  return padding + str;
}

export { padStart };