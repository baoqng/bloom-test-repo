// bloom-deps:

function buildEventEnvelope(
  eventType: unknown,
  payload: unknown,
  version: unknown
): { eventType: string; version: string; occurredAt: string; payload: unknown } {
  if (typeof eventType !== "string" || eventType.length === 0) {
    throw new TypeError("eventType must be a non-empty string");
  }

  const validEventTypePattern = /^[a-z0-9_.]+$/;
  if (
    !validEventTypePattern.test(eventType) ||
    eventType.startsWith(".") ||
    eventType.endsWith(".") ||
    eventType.startsWith("_") ||
    eventType.endsWith("_")
  ) {
    throw new SyntaxError("eventType must be snake_case or dot-separated");
  }

  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    throw new TypeError("payload must be a plain object");
  }

  if (typeof version !== "string" || version.length === 0) {
    throw new TypeError("version must be a non-empty string");
  }

  const semverPattern = /^\d+\.\d+\.\d+$/;
  if (!semverPattern.test(version)) {
    throw new SyntaxError("version must be semver (major.minor.patch)");
  }

  const occurredAt = new Date().toISOString();

  return {
    eventType,
    version,
    occurredAt,
    payload,
  };
}

export { buildEventEnvelope };