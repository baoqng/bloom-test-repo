// bloom-deps:

function capitalize(s: unknown): string {
  if (typeof s !== 'string') {
    throw new TypeError('Expected string');
  }
  if (s.length === 0) {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export { capitalize };