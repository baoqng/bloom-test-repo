// bloom-deps:

export function validateWebhookAge(timestampHeader: unknown, toleranceMs: unknown): number {
  if (typeof timestampHeader !== "string") {
    throw new TypeError("timestampHeader must be a string");
  }

  if (typeof toleranceMs !== "number" || !Number.isFinite(toleranceMs)) {
    throw new TypeError("toleranceMs must be a finite number");
  }

  if (!Number.isInteger(toleranceMs) || toleranceMs <= 0) {
    throw new RangeError("toleranceMs must be a positive integer");
  }

  if (timestampHeader.length === 0 || !/^\d+$/.test(timestampHeader)) {
    throw new SyntaxError("Invalid timestamp header");
  }

  const timestampSeconds = parseInt(timestampHeader, 10);
  const timestampMs = timestampSeconds * 1000;

  const now = Date.now();
  const diff = now - timestampMs;

  if (diff > toleranceMs) {
    throw new RangeError("Webhook timestamp is too old");
  }

  if (timestampMs - now > toleranceMs) {
    throw new RangeError("Webhook timestamp is in the future");
  }

  return timestampMs;
}