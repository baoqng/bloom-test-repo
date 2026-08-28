// bloom-deps:

function normalizeUrlPath(path: unknown): string {
  if (typeof path !== 'string') {
    throw new TypeError('path must be a string');
  }

  if (path === '') {
    throw new RangeError('path must not be empty');
  }

  let result = path.toLowerCase();

  result = result.split(' ').join('%20');

  result = result.replace(/^\/+|\/+$/g, '');

  if (result === '' || result.split('%20').join('') === '') {
    throw new RangeError('path must not be empty after normalization');
  }

  // Check if result contains only %20 sequences (all spaces, no real content)
  const withoutEncoded = result.replace(/%20/g, '');
  if (withoutEncoded === '') {
    throw new RangeError('path must not be empty after normalization');
  }

  return result;
}

export { normalizeUrlPath };