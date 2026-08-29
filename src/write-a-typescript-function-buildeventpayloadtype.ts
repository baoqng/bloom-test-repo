// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

function generateUUIDv4(): string {
  return crypto.randomUUID();
}

export function buildEventPayload(type: unknown, data: unknown, metadata: unknown): string {
  if (typeof type !== 'string' || type.length === 0 || !/^[A-Z][A-Z0-9_]*$/.test(type)) {
    throw new TypeError('type must be a non-empty string matching /^[A-Z][A-Z0-9_]*$/');
  }

  if (!isPlainObject(data)) {
    throw new TypeError('data must be a plain object');
  }

  if (!isPlainObject(metadata)) {
    throw new TypeError('metadata must be a plain object');
  }

  const eventId = generateUUIDv4();
  const timestamp = Date.now();

  const ordered: Record<string, unknown> = {};
  ordered['type'] = type;
  ordered['data'] = data;
  ordered['metadata'] = metadata;
  ordered['eventId'] = eventId;
  ordered['timestamp'] = timestamp;

  return JSON.stringify(ordered);
}