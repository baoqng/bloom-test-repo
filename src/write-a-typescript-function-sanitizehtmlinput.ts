// bloom-deps:

export function sanitizeHtml(input: unknown, allowedTags?: string[]): string {
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

  const allowedTagsLower = new Set(effectiveAllowedTags.map((t) => t.toLowerCase()));

  // Remove script tags and their entire content (case-insensitive)
  let result = input.replace(/<script[\s\S]*?<\/script\s*>/gi, '');

  // Remove style tags and their entire content (case-insensitive)
  result = result.replace(/<style[\s\S]*?<\/style\s*>/gi, '');

  // Remove HTML comments
  result = result.replace(/<!--[\s\S]*?-->/g, '');

  // Process remaining tags
  result = result.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g, (match, tagName) => {
    const tagNameLower = tagName.toLowerCase();
    if (allowedTagsLower.has(tagNameLower)) {
      return match;
    }
    return '';
  });

  return result;
}