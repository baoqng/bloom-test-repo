// bloom-deps:

import { randomUUID } from 'crypto';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  return Object.getPrototypeOf(value) === Object.prototype;
}

export function buildAuditEvent(params: {
  action: string;
  actorId: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, { before: unknown; after: unknown }>;
  metadata?: Record<string, unknown>;
}): {
  id: string;
  action: string;
  actorId: string;
  resourceType: string;
  resourceId: string;
  changes: Record<string, { before: unknown; after: unknown }>;
  metadata: Record<string, unknown>;
  timestamp: string;
} {
  if (!isPlainObject(params)) {
    throw new TypeError('params must be a plain object');
  }

  const { action, actorId, resourceType, resourceId, changes, metadata } = params;

  if (typeof action !== 'string' || action.length === 0) {
    throw new TypeError('action must be a non-empty string');
  }

  if (typeof actorId !== 'string' || actorId.length === 0) {
    throw new TypeError('actorId must be a non-empty string');
  }

  if (typeof resourceType !== 'string' || resourceType.length === 0) {
    throw new TypeError('resourceType must be a non-empty string');
  }

  if (typeof resourceId !== 'string' || resourceId.length === 0) {
    throw new TypeError('resourceId must be a non-empty string');
  }

  if (changes !== undefined && !isPlainObject(changes)) {
    throw new TypeError('changes must be a plain object');
  }

  if (metadata !== undefined && !isPlainObject(metadata)) {
    throw new TypeError('metadata must be a plain object');
  }

  return {
    id: randomUUID(),
    action,
    actorId,
    resourceType,
    resourceId,
    changes: changes ?? {},
    metadata: metadata ?? {},
    timestamp: new Date().toISOString(),
  };
}