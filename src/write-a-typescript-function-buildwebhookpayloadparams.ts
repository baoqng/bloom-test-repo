// bloom-deps:

import { randomUUID } from 'crypto';

interface WebhookParams {
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
  if (value === null || typeof value !== 'object') {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  return Object.getPrototypeOf(value) === Object.prototype;
}

export function buildWebhookPayload(params: unknown): WebhookPayload {
  // Validate params is a plain object
  if (!isPlainObject(params)) {
    throw new TypeError('params must be a plain object');
  }

  const typedParams = params as Record<string, unknown>;

  // Validate eventType is a non-empty string
  const eventType = typedParams.eventType;
  if (typeof eventType !== 'string' || eventType.length === 0) {
    throw new TypeError('eventType must be a non-empty string');
  }

  // Validate eventType matches pattern
  const eventTypePattern = /^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/;
  if (!eventTypePattern.test(eventType)) {
    throw new TypeError('eventType must match pattern <domain>.<action>');
  }

  // Validate data is a plain object
  const data = typedParams.data;
  if (!isPlainObject(data)) {
    throw new TypeError('data must be a plain object');
  }

  // Validate source is a non-empty string
  const source = typedParams.source;
  if (typeof source !== 'string' || source.length === 0) {
    throw new TypeError('source must be a non-empty string');
  }

  // Handle version parameter
  let version = '1.0';
  if (typedParams.version !== undefined) {
    const versionValue = typedParams.version;
    if (typeof versionValue !== 'string' || versionValue.length === 0) {
      throw new TypeError('version must be a non-empty string');
    }
    version = versionValue;
  }

  // Generate id as UUID v4
  const id = randomUUID();

  // Generate timestamp as ISO string
  const timestamp = new Date().toISOString();

  // Return the constructed payload
  return {
    id,
    eventType,
    source,
    version,
    timestamp,
    data: data as Record<string, unknown>,
  };
}