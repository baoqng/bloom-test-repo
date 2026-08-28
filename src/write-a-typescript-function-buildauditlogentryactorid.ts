// bloom-deps:

export interface AuditLogEntry {
  actorId: string;
  action: string;
  resourceId: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildAuditLogEntry(
  actorId: unknown,
  action: unknown,
  resourceId: unknown,
  metadata: unknown
): AuditLogEntry {
  if (typeof actorId !== 'string' || actorId.length === 0) {
    throw new TypeError('actorId must be a non-empty string');
  }

  if (typeof action !== 'string' || action.length === 0) {
    throw new TypeError('action must be a non-empty string');
  }

  if (typeof resourceId !== 'string' || resourceId.length === 0) {
    throw new TypeError('resourceId must be a non-empty string');
  }

  if (!isPlainObject(metadata)) {
    throw new TypeError('metadata must be a plain object');
  }

  const timestamp = new Date().toISOString();

  return {
    actorId,
    action,
    resourceId,
    metadata,
    timestamp,
  };
}