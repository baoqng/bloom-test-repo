// bloom-deps:

export function isValidEmail(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return false;
  }

  // Reject if the original value (with whitespace) differs from trimmed
  if (value !== trimmed) {
    return false;
  }

  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;

  if (!local || local.length === 0) return false;

  if (!domain || domain.length === 0) return false;

  if (!domain.includes('.')) return false;

  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;
  for (const part of domainParts) {
    if (!part || part.length === 0) return false;
  }

  return true;
}