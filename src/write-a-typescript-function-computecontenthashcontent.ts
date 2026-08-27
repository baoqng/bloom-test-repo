// bloom-deps:
import { createHash } from "crypto";

export function computeContentHash(content: unknown, prefix?: unknown): string {
  if (typeof content !== "string" && !Buffer.isBuffer(content)) {
    throw new TypeError("content must be a string or Buffer");
  }

  if (prefix !== undefined && typeof prefix !== "string") {
    throw new TypeError("prefix must be a string");
  }

  const data: Buffer = typeof content === "string"
    ? Buffer.from(content, "utf8")
    : content as Buffer;

  const hexDigest = createHash("sha256").update(data).digest("hex").toLowerCase();

  if (typeof prefix === "string") {
    const trimmedPrefix = prefix.trim();
    if (trimmedPrefix.length > 0) {
      return trimmedPrefix + ":" + hexDigest;
    }
  }

  return hexDigest;
}