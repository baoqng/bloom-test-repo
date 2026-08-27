// bloom-deps:
import { createHash } from "crypto";

export function computeNonceValue(
  requestId: unknown,
  timestamp: unknown,
  secret: unknown
): string {
  if (typeof requestId !== "string") {
    throw new TypeError("requestId must be a string");
  }
  if (typeof timestamp !== "number") {
    throw new TypeError("timestamp must be a number");
  }
  if (typeof secret !== "string") {
    throw new TypeError("secret must be a string");
  }

  if (!requestId.trim()) {
    throw new RangeError("requestId must not be empty");
  }
  if (!Number.isFinite(timestamp) || !Number.isInteger(timestamp) || timestamp <= 0) {
    throw new RangeError("timestamp must be a positive finite integer");
  }
  if (!secret.trim()) {
    throw new RangeError("secret must not be empty");
  }

  const payload = `${requestId.trim()}:${timestamp.toString()}:${secret.trim()}`;
  const hash = createHash("sha256").update(payload, "utf8").digest();
  return hash.slice(0, 16).toString("hex");
}