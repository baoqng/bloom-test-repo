// bloom-deps:

function parseScheme(url: unknown): string {
  // Check if input is a string
  if (typeof url !== 'string') {
    throw new TypeError('url must be a string');
  }

  // Check if the string contains '://'
  const schemeDelimiter = '://';
  const delimiterIndex = url.indexOf(schemeDelimiter);
  
  if (delimiterIndex === -1) {
    throw new SyntaxError('URL has no scheme');
  }

  // Extract the scheme (portion before '://')
  const scheme = url.substring(0, delimiterIndex);

  // Check if scheme is empty
  if (scheme.length === 0) {
    throw new SyntaxError('Invalid scheme');
  }

  // Check if scheme starts with a digit
  if (/^\d/.test(scheme)) {
    throw new SyntaxError('Invalid scheme');
  }

  // Check if scheme contains only valid characters [a-zA-Z0-9+\-.]
  if (!/^[a-zA-Z0-9+\-.]+$/.test(scheme)) {
    throw new SyntaxError('Invalid scheme');
  }

  // Return the scheme lowercased
  return scheme.toLowerCase();
}

export { parseScheme };