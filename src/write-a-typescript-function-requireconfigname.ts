// bloom-deps:

export function requireConfig(name: unknown, value: unknown): string {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('Config name must be a non-empty string');
  }
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError('Config value must be a non-empty string');
  }
  return value;
}