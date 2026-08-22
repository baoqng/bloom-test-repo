// bloom-deps:

import { randomUUID } from 'crypto';

interface WebhookPayloadParams {
  eventType: string;
  data: Record<string, unknown>;
  source: string;
  version?: string;
}

interface WebhookPayload {
  id: string;
  eventType: string;
  source: string;
  version: string;
  timestamp: string;
  data: Record<string, unknown>;
}

function isPlainObject(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function buildWebhookPayload(
  params: unknown
): WebhookPayload {
  // Validate params is a plain object
  if (!isPlainObject(params)) {
    throw new TypeError('params must be a plain object');
  }

  const typedParams = params as Record<string, unknown>;

  // Validate eventType
  const eventType = typedParams.eventType;
  if (typeof eventType !== 'string' || eventType.length === 0) {
    throw new TypeError('eventType must be a non-empty string');
  }

  // Validate eventType matches pattern
  if (!/^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/.test(eventType)) {
    throw new TypeError('eventType must match pattern <domain>.<action>');
  }

  // Validate data is a plain object
  const data = typedParams.data;
  if (!isPlainObject(data)) {
    throw new TypeError('data must be a plain object');
  }

  // Validate source
  const source = typedParams.source;
  if (typeof source !== 'string' || source.length === 0) {
    throw new TypeError('source must be a non-empty string');
  }

  // Validate version (optional, defaults to '1.0')
  let version = '1.0';
  if (typedParams.version !== undefined) {
    const versionValue = typedParams.version;
    if (typeof versionValue !== 'string' || versionValue.length === 0) {
      throw new TypeError('version must be a non-empty string');
    }
    version = versionValue;
  }

  // Build payload
  const payload: WebhookPayload = {
    id: randomUUID(),
    eventType,
    source,
    version,
    timestamp: new Date().toISOString(),
    data: data as Record<string, unknown>,
  };

  return payload;
}

export { buildWebhookPayload, WebhookPayload, WebhookPayloadParams };