// bloom-deps:

function parseTaggedValue(input: string): { tag: string; value: string } {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const separatorIndex = input.indexOf(':');
  if (separatorIndex === -1) {
    throw new RangeError('Missing colon separator');
  }

  const rawTag = input.slice(0, separatorIndex);
  const rawValue = input.slice(separatorIndex + 1);

  const trimmedTag = rawTag.trim();
  const trimmedValue = rawValue.trim();

  if (trimmedTag.length === 0) {
    throw new RangeError('Tag must not be empty');
  }

  if (/\s/.test(trimmedTag)) {
    throw new TypeError('Tag must not contain whitespace');
  }

  return { tag: trimmedTag, value: trimmedValue };
}

export { parseTaggedValue };