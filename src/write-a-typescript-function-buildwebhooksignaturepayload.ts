// bloom-deps: crypto@^1

import crypto from "crypto";

export function buildWebhookSignature(
  payload: unknown,
  secret: unknown,
  timestamp: unknown
): string {
  // Validate payload
  if (typeof payload !== "string" || payload.length === 0) {
    throw new TypeError("payload must be a non-empty string");
  }

  // Validate secret
  if (typeof secret !== "string" || secret.length === 0) {
    throw new TypeError("secret must be a non-empty string");
  }

  // Validate timestamp
  if (
    typeof timestamp !== "number" ||
    !Number.isInteger(timestamp) ||
    timestamp <= 0
  ) {
    throw new TypeError("timestamp must be a positive integer");
  }

  // Construct the signed payload string
  const signedPayload = timestamp.toString() + "." + payload;

  // Compute HMAC-SHA256
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(signedPayload);
  const hexSignature = hmac.digest("hex");

  // Return the signature in the required format
  return `t=${timestamp},v1=${hexSignature}`;
}