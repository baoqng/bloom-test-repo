// bloom-deps:

export function buildServiceTag(service: string, component: string, env: string): string {
  if (typeof service !== 'string' || service.length === 0) {
    throw new TypeError('service must be a non-empty string');
  }
  if (service.includes(':')) {
    throw new TypeError('service must not contain ":"');
  }

  if (typeof component !== 'string' || component.length === 0) {
    throw new TypeError('component must be a non-empty string');
  }
  if (component.includes(':')) {
    throw new TypeError('component must not contain ":"');
  }

  if (typeof env !== 'string' || env.length === 0) {
    throw new TypeError('env must be a non-empty string');
  }
  if (env.includes(':')) {
    throw new TypeError('env must not contain ":"');
  }

  return service + ':' + component + ':' + env;
}