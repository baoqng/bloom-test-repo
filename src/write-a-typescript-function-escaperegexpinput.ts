// bloom-deps:

function escapeRegExp(input: string): string {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string but received ${typeof input}`);
  }

  if (input.length === 0) {
    return '';
  }

  return input.replace(/[.*+?^${}()[\]|\\\/]/g, '\\$&');
}

export { escapeRegExp };