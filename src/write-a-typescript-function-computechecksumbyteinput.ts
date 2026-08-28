// bloom-deps:

function computeChecksumByte(input: unknown): number {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }
  if (input.length === 0) {
    throw new RangeError('input must not be empty');
  }
  for (let i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) > 127) {
      throw new RangeError('input must contain only ASCII characters');
    }
  }
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += input.charCodeAt(i);
  }
  return sum % 256;
}

export { computeChecksumByte };