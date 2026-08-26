// bloom-deps:

export function parseNamespacedKey(key: unknown): { namespace: string; identifier: string } {
  if (typeof key !== "string") {
    throw new TypeError("key must be a string");
  }

  if (key.trim().length === 0) {
    throw new RangeError("key must not be empty");
  }

  const colonCount = (key.match(/:/g) || []).length;
  if (colonCount !== 1) {
    throw new RangeError("key must contain exactly one colon separator");
  }

  const colonIndex = key.indexOf(":");
  const rawNamespace = key.substring(0, colonIndex);
  const rawIdentifier = key.substring(colonIndex + 1);

  const trimmedNamespace = rawNamespace.trim();
  const trimmedIdentifier = rawIdentifier.trim();

  if (trimmedNamespace.length === 0) {
    throw new RangeError("namespace must not be empty");
  }

  if (trimmedIdentifier.length === 0) {
    throw new RangeError("identifier must not be empty");
  }

  return { namespace: trimmedNamespace, identifier: trimmedIdentifier };
}