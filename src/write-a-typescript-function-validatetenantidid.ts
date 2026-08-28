// bloom-deps:

export function validateTenantId(id: unknown): string {
  if (typeof id !== 'string') {
    throw new TypeError('tenant ID must be a non-empty string');
  }

  if (id.length === 0 || id.length < 3 || id.length > 64) {
    throw new RangeError('Invalid tenant ID format');
  }

  if (!/^[A-Za-z0-9-]+$/.test(id)) {
    throw new RangeError('Invalid tenant ID format');
  }

  if (id.startsWith('-') || id.endsWith('-')) {
    throw new RangeError('Invalid tenant ID format');
  }

  return id;
}