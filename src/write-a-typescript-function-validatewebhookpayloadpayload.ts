// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== "object") return false;
  let proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype) return true;
  while (proto !== null) {
    if (
      proto.constructor !== undefined &&
      typeof proto.constructor === "function" &&
      proto.constructor !== Object
    ) {
      return false;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return true;
}

export function validateWebhookPayload(payload: unknown): {
  event: string;
  timestamp: number;
  data: Record<string, unknown>;
} {
  if (!isPlainObject(payload)) {
    throw new TypeError("payload must be a plain non-null object");
  }

  const obj = payload as Record<string, unknown>;

  if (!("event" in obj)) {
    throw new RangeError("payload must have an 'event' property");
  }
  if (typeof obj["event"] !== "string" || obj["event"].length === 0) {
    throw new RangeError("'event' must be a non-empty string");
  }

  if (!("timestamp" in obj)) {
    throw new RangeError("payload must have a 'timestamp' property");
  }
  const ts = obj["timestamp"];
  if (typeof ts !== "number" || !Number.isFinite(ts)) {
    throw new RangeError("'timestamp' must be a finite number");
  }
  if (!Number.isInteger(ts) || ts <= 0) {
    throw new RangeError("'timestamp' must be a positive integer");
  }

  if (!("data" in obj)) {
    throw new RangeError("payload must have a 'data' property");
  }
  if (!isPlainObject(obj["data"])) {
    throw new RangeError("'data' must be a plain non-null object");
  }

  return obj as { event: string; timestamp: number; data: Record<string, unknown> };
}