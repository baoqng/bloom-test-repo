// bloom-deps:
import crypto from 'crypto';

export function buildAuditEvent(
  action: string,
  actor: { id: string; type: 'user' | 'service' | 'system' },
  resource: { type: string; id: string },
  options?: {
    outcome?: 'success' | 'failure';
    metadata?: Record<string, unknown>;
    correlationId?: string;
  }
): {
  eventId: string;
  timestamp: string;
  action: string;
  actor: { id: string; type: 'user' | 'service' | 'system' };
  resource: { type: string; id: string };
  outcome: 'success' | 'failure';
  metadata: Record<string, unknown>;
  correlationId: string | null;
} {
  if (typeof action !== 'string' || action.trim() === '') {
    throw new TypeError('action must be a non-empty string');
  }

  if (typeof actor?.id !== 'string' || actor.id.trim() === '') {
    throw new TypeError('actor.id must be a non-empty string');
  }

  if (typeof resource?.type !== 'string' || resource.type.trim() === '') {
    throw new TypeError('resource.type must be a non-empty string');
  }

  if (typeof resource?.id !== 'string' || resource.id.trim() === '') {
    throw new TypeError('resource.id must be a non-empty string');
  }

  const eventId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const outcome = options?.outcome ?? 'success';
  const metadata = options?.metadata ?? {};
  const correlationId = options?.correlationId !== undefined ? options.correlationId : null;

  return {
    eventId,
    timestamp,
    action,
    actor,
    resource,
    outcome,
    metadata,
    correlationId,
  };
}