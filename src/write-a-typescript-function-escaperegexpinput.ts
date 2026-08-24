// bloom-deps:

function escapeRegExp(input: string): string {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  if (input === '') {
    return '';
  }

  return input.replace(/[.*+?^${}()[\]|\\\/]/g, '\\$&');
}

export { escapeRegExp };