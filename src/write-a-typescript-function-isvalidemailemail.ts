// bloom-deps:

export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') {
    throw new TypeError('email must be a string');
  }

  if (email.length === 0) {
    return false;
  }

  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;

  if (typeof local !== 'string' || local.length === 0) {
    return false;
  }

  if (typeof domain !== 'string' || domain.length === 0) {
    return false;
  }

  const domainSegments = domain.split('.');
  if (domainSegments.length < 2) {
    return false;
  }

  for (const segment of domainSegments) {
    if (typeof segment !== 'string' || segment.length === 0) {
      return false;
    }
  }

  return true;
}