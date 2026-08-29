// bloom-deps: uuid@^9

import { v4 as uuidv4 } from 'uuid';

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildAuditEvent(
  actor: unknown,
  action: unknown,
  target: unknown,
  outcome: unknown,
  metadata: unknown
): Record<string, unknown> {
  if (!isPlainObject(actor) || typeof (actor as Record<string, unknown>)['id'] !== 'string' || ((actor as Record<string, unknown>)['id'] as string).length === 0) {
    throw new TypeError('actor must be a plain object with a non-empty string id');
  }

  if (typeof action !== 'string' || action.length === 0) {
    throw new TypeError('action must be a non-empty string');
  }

  if (!isPlainObject(target) || typeof (target as Record<string, unknown>)['id'] !== 'string' || ((target as Record<string, unknown>)['id'] as string).length === 0) {
    throw new TypeError('target must be a plain object with a non-empty string id');
  }

  if (outcome !== 'success' && outcome !== 'failure') {
    throw new TypeError("outcome must be 'success' or 'failure'");
  }

  if (!isPlainObject(metadata)) {
    throw new TypeError('metadata must be a plain object');
  }

  const result: Record<string, unknown> = {
    id: uuidv4(),
    timestamp: Date.now(),
    actor,
    action,
    target,
    outcome,
    metadata,
  };

  return result;
}