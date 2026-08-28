// bloom-deps:

export function buildScopeToken(service: unknown, resource: unknown, action: unknown): string {
  if (typeof service !== 'string') {
    throw new TypeError('service must be a string');
  }
  if (typeof resource !== 'string') {
    throw new TypeError('resource must be a string');
  }
  if (typeof action !== 'string') {
    throw new TypeError('action must be a string');
  }

  const trimmedService = service.trim();
  const trimmedResource = resource.trim();
  const trimmedAction = action.trim();

  if (trimmedService.length === 0) {
    throw new RangeError('service must not be empty');
  }
  if (trimmedResource.length === 0) {
    throw new RangeError('resource must not be empty');
  }
  if (trimmedAction.length === 0) {
    throw new RangeError('action must not be empty');
  }

  if (/[^a-z0-9-]/.test(trimmedService)) {
    throw new RangeError('service must contain only lowercase letters, digits, and hyphens');
  }
  if (/[^a-z0-9\-."]/.test(trimmedResource.replace(/\./g, ''))) {
    throw new RangeError('resource must contain only lowercase letters, digits, hyphens, and dots');
  }
  if (/[^a-z0-9.-]/.test(trimmedResource)) {
    throw new RangeError('resource must contain only lowercase letters, digits, hyphens, and dots');
  }
  if (/[^a-z-]/.test(trimmedAction)) {
    throw new RangeError('action must contain only lowercase letters and hyphens');
  }

  return `${trimmedService}.${trimmedResource}:${trimmedAction}`;
}