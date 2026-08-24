// bloom-deps:

import { randomUUID } from 'crypto';

interface Actor {
  id: string;
  type: 'user' | 'service' | 'system';
}

interface Resource {
  type: string;
  id: string;
}

interface AuditEventOptions {
  outcome?: 'success' | 'failure';
  metadata?: Record<string, unknown>;
  correlationId?: string;
}

interface AuditEvent {
  eventId: string;
  timestamp: string;
  action: string;
  actor: Actor;
  resource: Resource;
  outcome: 'success' | 'failure';
  metadata: Record<string, unknown>;
  correlationId: string | null;
}

function buildAuditEvent(
  action: string,
  actor: Actor,
  resource: Resource,
  options?: AuditEventOptions
): AuditEvent {
  // Validate action
  if (typeof action !== 'string' || action.length === 0) {
    throw new TypeError('action must be a non-empty string');
  }

  // Validate actor
  if (!actor || typeof actor !== 'object') {
    throw new TypeError('actor must be an object');
  }
  if (typeof actor.id !== 'string' || actor.id.length === 0) {
    throw new TypeError('actor.id must be a non-empty string');
  }
  if (!['user', 'service', 'system'].includes(actor.type)) {
    throw new TypeError("actor.type must be 'user', 'service', or 'system'");
  }

  // Validate resource
  if (!resource || typeof resource !== 'object') {
    throw new TypeError('resource must be an object');
  }
  if (typeof resource.id !== 'string' || resource.id.length === 0) {
    throw new TypeError('resource.id must be a non-empty string');
  }
  if (typeof resource.type !== 'string' || resource.type.length === 0) {
    throw new TypeError('resource.type must be a non-empty string');
  }

  // Determine outcome - default to 'success' if not provided
  const outcome: 'success' | 'failure' = options?.outcome ?? 'success';

  // Determine correlationId - null if not provided
  const correlationId: string | null = options?.correlationId ?? null;

  // Build metadata - empty object if not provided
  const metadata: Record<string, unknown> = options?.metadata ?? {};

  // Create audit event
  const event: AuditEvent = {
    eventId: randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    actor,
    resource,
    outcome,
    metadata,
    correlationId,
  };

  return event;
}

export { buildAuditEvent, AuditEvent, Actor, Resource, AuditEventOptions };