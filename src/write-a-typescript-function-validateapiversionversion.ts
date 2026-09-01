// bloom-deps:

export function validateApiVersion(version: unknown): string {
  if (typeof version !== 'string') {
    throw new TypeError('Invalid API version');
  }

  const trimmed = version.trim();

  if (trimmed.length === 0) {
    throw new TypeError('Invalid API version');
  }

  const pattern = /^v?\d+\.\d+\.\d+$/;

  if (!pattern.test(trimmed)) {
    throw new TypeError('Invalid API version');
  }

  if (trimmed.startsWith('v')) {
    return trimmed;
  }

  return 'v' + trimmed;
}