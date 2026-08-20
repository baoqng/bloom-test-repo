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

  if (!local || local.length === 0) return false;

  if (!domain || domain.length === 0) return false;

  const domainSegments = domain.split('.');
  if (domainSegments.length < 2) return false;

  for (const segment of domainSegments) {
    if (!segment || segment.length === 0) return false;
  }

  return true;
}