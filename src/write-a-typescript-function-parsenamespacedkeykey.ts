// bloom-deps:

export function parseNamespacedKey(key: unknown): { namespace: string; identifier: string } {
  if (typeof key !== 'string') {
    throw new TypeError('key must be a string');
  }

  if (!key.trim()) {
    throw new RangeError('key must not be empty');
  }

  // Count colon occurrences explicitly using indexOf+slice
  let colonCount = 0;
  let searchStr = key;
  let pos = searchStr.indexOf(':');
  while (pos !== -1) {
    colonCount++;
    searchStr = searchStr.slice(pos + 1);
    pos = searchStr.indexOf(':');
  }

  if (colonCount !== 1) {
    throw new RangeError('key must contain exactly one colon separator');
  }

  // Use indexOf+slice to split on first (and only) colon
  const colonIndex = key.indexOf(':');
  const rawNamespace = key.slice(0, colonIndex);
  const rawIdentifier = key.slice(colonIndex + 1);

  const trimmedNamespace = rawNamespace.trim();
  const trimmedIdentifier = rawIdentifier.trim();

  if (!trimmedNamespace) {
    throw new RangeError('namespace must not be empty');
  }

  if (!trimmedIdentifier) {
    throw new RangeError('identifier must not be empty');
  }

  return { namespace: trimmedNamespace, identifier: trimmedIdentifier };
}