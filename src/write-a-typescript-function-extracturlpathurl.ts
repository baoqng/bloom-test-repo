// bloom-deps:

function extractUrlPath(url: unknown): string {
  if (typeof url !== 'string') {
    throw new TypeError('url must be a string');
  }

  if (!url.includes('://')) {
    throw new SyntaxError('url must be an absolute URL');
  }

  // Find the end of '://'
  const schemeEnd = url.indexOf('://');
  const afterScheme = schemeEnd + 3;

  // Find the first '/' after the authority
  const slashIndex = url.indexOf('/', afterScheme);

  if (slashIndex === -1) {
    return '/';
  }

  // Extract path starting from the leading '/'
  let path = url.slice(slashIndex);

  // Strip query string
  const queryIndex = path.indexOf('?');
  if (queryIndex !== -1) {
    path = path.slice(0, queryIndex);
  }

  // Strip fragment
  const fragmentIndex = path.indexOf('#');
  if (fragmentIndex !== -1) {
    path = path.slice(0, fragmentIndex);
  }

  // If path is empty after stripping, return '/'
  if (path === '' || path === '/') {
    return '/';
  }

  return path;
}

export { extractUrlPath };