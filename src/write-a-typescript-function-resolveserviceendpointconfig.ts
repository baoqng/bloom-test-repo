// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  let proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype) return true;
  while (proto !== null) {
    if (proto.constructor !== undefined && typeof proto.constructor === 'function' && proto.constructor !== Object) return false;
    proto = Object.getPrototypeOf(proto);
  }
  return true;
}

export function resolveServiceEndpoint(config: unknown, serviceName: unknown, path?: unknown): string {
  // Validate config
  if (config === null || typeof config !== 'object' || Array.isArray(config)) {
    throw new TypeError('config must be an object');
  }

  // Validate serviceName type
  if (typeof serviceName !== 'string') {
    throw new TypeError('serviceName must be a string');
  }

  // Validate serviceName not empty/whitespace
  if (!serviceName.trim()) {
    throw new RangeError('serviceName must not be empty');
  }

  // Validate path if provided
  if (path !== undefined) {
    if (typeof path !== 'string') {
      throw new TypeError('path must be a string');
    }
  }

  // Validate config.services
  const configObj = config as Record<string, unknown>;
  if (!('services' in configObj) || configObj['services'] === undefined || configObj['services'] === null || !isPlainObject(configObj['services'])) {
    throw new SyntaxError('config.services must be an object');
  }

  const services = configObj['services'] as Record<string, unknown>;
  const trimmedServiceName = serviceName.trim();

  // Check if service exists
  if (!(trimmedServiceName in services)) {
    throw new RangeError('unknown service');
  }

  // Validate the service base URL
  const baseUrl = services[trimmedServiceName];
  if (typeof baseUrl !== 'string' || baseUrl.length === 0) {
    throw new SyntaxError('service base URL must be a non-empty string');
  }

  // Strip trailing slashes from base URL
  let normalizedBase = baseUrl.replace(/\/+$/, '');

  // Handle path
  if (path !== undefined) {
    const pathStr = path as string;
    const trimmedPath = pathStr.trim();
    if (trimmedPath.length > 0) {
      if (!trimmedPath.startsWith('/')) {
        return normalizedBase + '/' + trimmedPath;
      } else {
        return normalizedBase + trimmedPath;
      }
    }
  }

  return normalizedBase;
}