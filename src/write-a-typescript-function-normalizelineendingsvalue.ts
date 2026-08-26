// bloom-deps:

function normalizeLineEndings(value: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  // Replace CRLF first, then remaining CR
  return value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

export { normalizeLineEndings };