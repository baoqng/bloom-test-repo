// bloom-deps:

export function normalizeEmail(email: unknown): string {
  if (typeof email !== 'string' || email.length === 0) {
    throw new TypeError('email must be a non-empty string');
  }

  const trimmed = email.trim();

  if (trimmed.length === 0) {
    throw new TypeError('email must be a non-empty string');
  }

  // Count '@' occurrences explicitly
  let atCount = 0;
  let atIndex = -1;
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed[i] === '@') {
      atCount++;
      atIndex = i;
    }
  }

  if (atCount !== 1) {
    throw new SyntaxError('email must contain exactly one "@" character');
  }

  const localPart = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);

  if (localPart.length === 0) {
    throw new SyntaxError('local part must not be empty');
  }

  if (domain.length === 0) {
    throw new SyntaxError('domain must not be empty');
  }

  if (!domain.includes('.')) {
    throw new SyntaxError('domain must contain at least one "." character');
  }

  if (domain.startsWith('.')) {
    throw new SyntaxError('domain must not start with "."');
  }

  if (domain.endsWith('.')) {
    throw new SyntaxError('domain must not end with "."');
  }

  const lowercaseDomain = domain.toLowerCase();

  return `${localPart}@${lowercaseDomain}`;
}