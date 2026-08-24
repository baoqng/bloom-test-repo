// bloom-deps:

export function parseQueryParam(url: unknown, name: unknown): string | null {
  // Validate url parameter
  if (typeof url !== 'string') {
    throw new TypeError('url must be a string');
  }

  if (url.length === 0) {
    throw new TypeError('url must be a non-empty string');
  }

  // Validate name parameter
  if (typeof name !== 'string') {
    throw new TypeError('name must be a string');
  }

  if (name.length === 0) {
    throw new TypeError('name must be a non-empty string');
  }

  // Validate that url is a valid absolute URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    throw new RangeError('url must be a valid absolute URL');
  }

  // Extract and parse query parameters
  const searchParams = new URLSearchParams(parsedUrl.search);

  // Get the first value for the named parameter, or null if absent
  const paramValue = searchParams.get(name);

  return paramValue;
}