// bloom-deps:

function truncateWords(text: string, maxWords: number): string {
  if (typeof text !== 'string' || !text && text !== '') {
    throw new TypeError('text must be a string');
  }
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }
  if (!Number.isInteger(maxWords) || maxWords < 1) {
    if (!Number.isInteger(maxWords)) {
      throw new TypeError('maxWords must be a positive integer');
    }
    throw new RangeError('maxWords must be >= 1');
  }

  const words = text.trim().split(/\s+/).filter(w => w.length > 0);

  if (text.trim() === '') {
    return text;
  }

  if (words.length <= maxWords) {
    return text;
  }

  return words.slice(0, maxWords).join(' ') + '\u2026';
}

export { truncateWords };