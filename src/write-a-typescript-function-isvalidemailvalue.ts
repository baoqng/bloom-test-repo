// bloom-deps:

export function isValidEmail(value: unknown): boolean {
  if (typeof value !== 'string' || value.length === 0) {
    return false;
  }

  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;

  if (!local || local.length === 0) {
    return false;
  }

  if (!domain || domain.length === 0) {
    return false;
  }

  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return false;
  }

  for (const segment of domainParts) {
    if (!segment || segment.length === 0) {
      return false;
    }
  }

  return true;
}