// bloom-deps:

function buildCachePurgeTag(namespace: string, identifiers: string[]): string {
  // Validate namespace is a non-empty string
  if (typeof namespace !== 'string' || namespace.length === 0) {
    throw new TypeError('namespace must be a non-empty string');
  }

  // Validate identifiers is a non-empty array
  if (!Array.isArray(identifiers) || identifiers.length === 0) {
    throw new TypeError('identifiers must be a non-empty array');
  }

  // Validate namespace does not contain / or +
  if (namespace.indexOf('/') !== -1 || namespace.indexOf('+') !== -1) {
    throw new TypeError('Namespace must not contain / or +');
  }

  // Validate each identifier
  for (let i = 0; i < identifiers.length; i++) {
    const identifier = identifiers[i];

    // Check if identifier is a non-empty string
    if (typeof identifier !== 'string' || identifier.length === 0) {
      throw new TypeError('Identifier must not be empty');
    }

    // Check if identifier contains / or +
    if (identifier.indexOf('/') !== -1 || identifier.indexOf('+') !== -1) {
      throw new TypeError('Identifier must not contain / or +');
    }
  }

  // Build the tag string
  const tag = namespace + '/' + identifiers.join('+');

  // Validate tag does not exceed 256 characters
  if (tag.length > 256) {
    throw new RangeError('Cache purge tag exceeds 256 characters');
  }

  return tag;
}

export { buildCachePurgeTag };