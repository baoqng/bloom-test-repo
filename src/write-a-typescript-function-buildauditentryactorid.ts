// bloom-deps:

function buildAuditEntry(
  actorId: unknown,
  action: unknown,
  resourceType: unknown,
  resourceId: unknown,
  outcome: unknown
): {
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  outcome: 'success' | 'failure';
  timestamp: string;
} {
  if (typeof actorId !== 'string' || actorId.trim().length === 0) {
    throw new TypeError('actorId must be a non-empty string');
  }

  if (typeof action !== 'string' || action.trim().length === 0) {
    throw new TypeError('action must be a non-empty string');
  }

  const trimmedAction = action.trim();
  if (!/^[a-zA-Z.:]+$/.test(trimmedAction)) {
    throw new RangeError('action must contain only letters, dots, and colons');
  }

  if (typeof resourceType !== 'string' || resourceType.trim().length === 0) {
    throw new TypeError('resourceType must be a non-empty string');
  }

  if (typeof resourceId !== 'string' || resourceId.trim().length === 0) {
    throw new TypeError('resourceId must be a non-empty string');
  }

  if (typeof outcome !== 'string') {
    throw new TypeError('outcome must be a string');
  }

  const normalizedOutcome = outcome.trim().toLowerCase();
  if (normalizedOutcome !== 'success' && normalizedOutcome !== 'failure') {
    throw new RangeError("outcome must be 'success' or 'failure'");
  }

  return {
    actorId: actorId.trim(),
    action: trimmedAction,
    resourceType: resourceType.trim(),
    resourceId: resourceId.trim(),
    outcome: normalizedOutcome as 'success' | 'failure',
    timestamp: new Date().toISOString(),
  };
}

export { buildAuditEntry };