// bloom-deps:

function sanitizeHtml(input: unknown, allowedTags?: string[]): string {
  // Validate input type
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  // Validate allowedTags if provided
  let tags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br'];
  if (allowedTags !== undefined) {
    if (!Array.isArray(allowedTags)) {
      throw new TypeError('allowedTags must be an array of strings');
    }
    for (const tag of allowedTags) {
      if (typeof tag !== 'string') {
        throw new TypeError('allowedTags must be an array of strings');
      }
    }
    tags = allowedTags;
  }

  // Create a Set of allowed tags (lowercase)
  const allowedSet = new Set(tags.map(t => t.toLowerCase()));

  let result = input;

  // Remove script and style tags with all their content
  result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  result = result.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove HTML comments
  result = result.replace(/<!--[\s\S]*?-->/g, '');

  // Process remaining tags
  result = result.replace(/<\/?[^>]+>/g, (match) => {
    // Extract tag name
    const tagMatch = match.match(/<\/?([^\s>/]+)/i);
    if (!tagMatch) {
      return match;
    }

    const tagName = tagMatch[1].toLowerCase();

    // Check if it's an allowed tag
    if (allowedSet.has(tagName)) {
      return match;
    }

    // Remove disallowed tag
    return '';
  });

  return result;
}

export { sanitizeHtml };