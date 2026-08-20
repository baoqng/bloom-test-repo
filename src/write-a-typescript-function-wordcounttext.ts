// bloom-deps:

function wordCount(text: string): number {
  if (typeof text !== 'string') {
    throw new TypeError('Expected a string');
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return 0;
  }
  return trimmed.split(/\s+/).length;
}

export { wordCount };