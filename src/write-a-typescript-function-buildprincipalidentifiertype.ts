// bloom-deps:

function buildPrincipalIdentifier(type: unknown, id: unknown, domain: unknown): string {
  if (typeof type !== 'string' || type.trim().length === 0) {
    throw new TypeError('type must be a non-empty string');
  }

  const trimmedType = type.trim();
  if (!/^[a-z][a-z-]*[a-z]$/.test(trimmedType) && !/^[a-z]$/.test(trimmedType)) {
    throw new RangeError('type must contain only lowercase letters and hyphens');
  }

  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new TypeError('id must be a non-empty string');
  }

  const trimmedId = id.trim();

  if (typeof domain !== 'string' || domain.trim().length === 0) {
    throw new TypeError('domain must be a non-empty string');
  }

  const trimmedDomain = domain.trim();

  if (trimmedDomain.includes('@') || /\s/.test(trimmedDomain)) {
    throw new RangeError("domain must not contain '@' or whitespace");
  }

  return `${trimmedType}:${trimmedId}@${trimmedDomain}`;
}

export { buildPrincipalIdentifier };