// bloom-deps:

function buildPrefixedKey(namespace: unknown, scope: unknown, resource: unknown): string {
  // Validate namespace is a string
  if (typeof namespace !== 'string') {
    throw new TypeError('namespace must be a string');
  }

  // Validate scope is a string
  if (typeof scope !== 'string') {
    throw new TypeError('scope must be a string');
  }

  // Validate resource is a string
  if (typeof resource !== 'string') {
    throw new TypeError('resource must be a string');
  }

  // Trim all values
  const trimmedNamespace = namespace.trim();
  const trimmedScope = scope.trim();
  const trimmedResource = resource.trim();

  // Validate namespace is not empty
  if (trimmedNamespace.length === 0) {
    throw new RangeError('namespace must not be empty');
  }

  // Validate scope is not empty
  if (trimmedScope.length === 0) {
    throw new RangeError('scope must not be empty');
  }

  // Validate resource is not empty
  if (trimmedResource.length === 0) {
    throw new RangeError('resource must not be empty');
  }

  // Validate namespace does not contain colons
  if (trimmedNamespace.indexOf(':') !== -1) {
    throw new RangeError('namespace must not contain colons');
  }

  // Validate scope does not contain colons
  if (trimmedScope.indexOf(':') !== -1) {
    throw new RangeError('scope must not contain colons');
  }

  // Validate resource does not contain colons
  if (trimmedResource.indexOf(':') !== -1) {
    throw new RangeError('resource must not contain colons');
  }

  // Return the concatenated key
  return `${trimmedNamespace}:${trimmedScope}:${trimmedResource}`;
}

export { buildPrefixedKey };