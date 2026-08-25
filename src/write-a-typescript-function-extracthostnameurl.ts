// bloom-deps:

function extractHostname(url: unknown): string {
  if (typeof url !== "string") {
    throw new TypeError("url must be a string");
  }

  const schemeSepIndex = url.indexOf("://");
  if (schemeSepIndex === -1) {
    throw new SyntaxError("url must be an absolute URL");
  }

  const afterScheme = url.slice(schemeSepIndex + 3);

  if (afterScheme.length === 0) {
    throw new SyntaxError("url must be an absolute URL");
  }

  // Find end of authority: next '/', '?', '#', or end of string
  let authorityEnd = afterScheme.length;
  for (const delimiter of ['/', '?', '#']) {
    const idx = afterScheme.indexOf(delimiter);
    if (idx !== -1 && idx < authorityEnd) {
      authorityEnd = idx;
    }
  }

  const authority = afterScheme.slice(0, authorityEnd);

  if (authority.length === 0) {
    throw new SyntaxError("url must be an absolute URL");
  }

  // Strip port suffix: colon followed by digits at end of authority
  let hostWithUserinfo = authority.replace(/:(\d+)$/, "");

  // Strip userinfo prefix: anything before and including the last '@'
  const atIndex = hostWithUserinfo.lastIndexOf('@');
  let hostname: string;
  if (atIndex !== -1) {
    hostname = hostWithUserinfo.slice(atIndex + 1);
  } else {
    hostname = hostWithUserinfo;
  }

  if (hostname.length === 0) {
    throw new SyntaxError("Invalid hostname");
  }

  return hostname.toLowerCase();
}

export { extractHostname };