// bloom-deps:

function sanitizeHtml(input: unknown, allowedTags?: string[]): string {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const defaultAllowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br'];

  let effectiveAllowedTags: string[];

  if (allowedTags === undefined) {
    effectiveAllowedTags = defaultAllowedTags;
  } else {
    if (
      !Array.isArray(allowedTags) ||
      !allowedTags.every((tag) => typeof tag === 'string')
    ) {
      throw new TypeError('allowedTags must be an array of strings');
    }
    effectiveAllowedTags = allowedTags;
  }

  const allowedSet = new Set(effectiveAllowedTags.map((t) => t.toLowerCase()));

  // Remove script tags and their content (case-insensitive)
  let result = input.replace(
    /<script[\s\S]*?>[\s\S]*?<\/script\s*>/gi,
    ''
  );

  // Remove style tags and their content (case-insensitive)
  result = result.replace(
    /<style[\s\S]*?>[\s\S]*?<\/style\s*>/gi,
    ''
  );

  // Remove HTML comments
  result = result.replace(/<!--[\s\S]*?-->/g, '');

  // Process remaining tags
  result = result.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s[^>]*)?)(\s*\/?)>/g, (
    match,
    closingSlash: string,
    tagName: string,
    attrs: string,
    selfClosing: string
  ) => {
    const lowerTag = tagName.toLowerCase();

    // Always remove script/style tags that might remain (edge cases)
    if (lowerTag === 'script' || lowerTag === 'style') {
      return '';
    }

    if (allowedSet.has(lowerTag)) {
      return match;
    }

    return '';
  });

  return result;
}

export { sanitizeHtml };