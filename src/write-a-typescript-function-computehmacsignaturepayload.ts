// bloom-deps:
import { createHmac } from "crypto";

export function computeHmacSignature(payload: unknown, secret: unknown): string {
  if (typeof payload !== "string" || payload.length === 0) {
    throw new TypeError("payload must be a non-empty string");
  }
  if (typeof secret !== "string" || secret.length === 0) {
    throw new TypeError("secret must be a non-empty string");
  }
  return createHmac("sha256", secret).update(payload).digest("hex");
}