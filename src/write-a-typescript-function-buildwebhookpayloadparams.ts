// bloom-deps:
import { randomUUID } from 'crypto';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  return Object.getPrototypeOf(value) === Object.prototype;
}

export function buildWebhookPayload(params: {
  eventType: string;
  data: Record<string, unknown>;
  source: string;
  version?: string;
}): {
  id: string;
  eventType: string;
  source: string;
  version: string;
  timestamp: string;
  data: Record<string, unknown>;
} {
  if (!isPlainObject(params)) {
    throw new TypeError('params must be a plain object');
  }

  const { eventType, data, source, version } = params;

  if (typeof eventType !== 'string' || eventType.length === 0) {
    throw new TypeError('eventType must be a non-empty string');
  }

  if (!/^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/.test(eventType)) {
    throw new TypeError('eventType must match pattern <domain>.<action>');
  }

  if (!isPlainObject(data)) {
    throw new TypeError('data must be a plain object');
  }

  if (typeof source !== 'string' || source.length === 0) {
    throw new TypeError('source must be a non-empty string');
  }

  let resolvedVersion = '1.0';
  if (version !== undefined) {
    if (typeof version !== 'string' || version.length === 0) {
      throw new TypeError('version must be a non-empty string');
    }
    resolvedVersion = version;
  }

  return {
    id: randomUUID(),
    eventType,
    source,
    version: resolvedVersion,
    timestamp: new Date().toISOString(),
    data,
  };
}