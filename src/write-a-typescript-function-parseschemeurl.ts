// bloom-deps:

export function parseScheme(url: unknown): string {
  if (typeof url !== "string") {
    throw new TypeError("url must be a string");
  }

  const delimiterIndex = url.indexOf("://");
  if (delimiterIndex === -1) {
    throw new SyntaxError("URL has no scheme");
  }

  const scheme = url.slice(0, delimiterIndex);

  if (scheme.length === 0) {
    throw new SyntaxError("Invalid scheme");
  }

  if (/^\d/.test(scheme)) {
    throw new SyntaxError("Invalid scheme");
  }

  if (!/^[a-zA-Z0-9+\-.]+$/.test(scheme)) {
    throw new SyntaxError("Invalid scheme");
  }

  return scheme.toLowerCase();
}