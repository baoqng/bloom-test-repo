// bloom-deps:

export function normalizeLocale(locale: unknown): string {
  if (typeof locale !== 'string') {
    throw new TypeError('Invalid locale format');
  }

  const trimmed = locale.trim();

  if (trimmed.length === 0) {
    throw new TypeError('Invalid locale format');
  }

  const pattern = /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/;

  if (!pattern.test(trimmed)) {
    throw new TypeError('Invalid locale format');
  }

  return trimmed.toLowerCase();
}