// bloom-deps:

function truncate(text: unknown, maxLength: unknown, ellipsis: string = '...'): string {
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }

  if (typeof ellipsis !== 'string') {
    throw new TypeError('ellipsis must be a string');
  }

  if (typeof maxLength !== 'number' || !Number.isInteger(maxLength) || isNaN(maxLength)) {
    throw new TypeError('maxLength must be an integer');
  }

  if (maxLength < 1) {
    throw new RangeError('maxLength must be at least 1');
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength) + ellipsis;
}

export { truncate };