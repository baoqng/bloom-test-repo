// bloom-deps:

export function extractHostname(url: unknown): string {
  if (typeof url !== "string") {
    throw new TypeError("url must be a string");
  }

  const separatorIndex = url.indexOf("://");
  if (separatorIndex === -1) {
    throw new SyntaxError("url must be an absolute URL");
  }

  const afterScheme = url.slice(separatorIndex + 3);

  if (afterScheme.length === 0) {
    throw new SyntaxError("url must be an absolute URL");
  }

  // Find the end of the authority component
  const delimiterMatch = afterScheme.search(/[/?#]/);
  let authority: string;
  if (delimiterMatch === -1) {
    authority = afterScheme;
  } else {
    authority = afterScheme.slice(0, delimiterMatch);
  }

  if (authority.length === 0) {
    throw new SyntaxError("url must be an absolute URL");
  }

  // Strip port suffix (colon followed by digits at end of authority)
  let hostname = authority.replace(/:(\d+)$/, "");

  // Strip userinfo prefix (anything before and including the last '@')
  const atIndex = hostname.lastIndexOf("@");
  if (atIndex !== -1) {
    hostname = hostname.slice(atIndex + 1);
  }

  if (hostname.length === 0) {
    throw new SyntaxError("Invalid hostname");
  }

  return hostname.toLowerCase();
}