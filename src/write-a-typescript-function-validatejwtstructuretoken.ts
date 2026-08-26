// bloom-deps:

function validateJwtStructure(token: unknown): { header: Record<string, unknown>; payloadSegment: string; signature: string } {
  if (typeof token !== "string") {
    throw new TypeError("token must be a string");
  }

  if (token.trim().length === 0) {
    throw new RangeError("token must not be empty");
  }

  const trimmed = token.trim();
  const parts = trimmed.split(".");

  if (parts.length !== 3 || parts.some(p => p.length === 0)) {
    throw new RangeError("token must have exactly 3 segments");
  }

  const base64urlRegex = /^[A-Za-z0-9\-_]+$/;

  for (let i = 0; i < parts.length; i++) {
    if (!base64urlRegex.test(parts[i])) {
      throw new RangeError(`segment ${i + 1} contains invalid base64url characters`);
    }
  }

  const headerSegment = parts[0];
  const payloadSegment = parts[1];
  const signature = parts[2];

  // Pad to multiple of 4
  const padded = headerSegment + "=".repeat((4 - (headerSegment.length % 4)) % 4);
  const decoded = Buffer.from(padded, "base64url").toString("utf-8");

  let parsedHeader: unknown;
  try {
    parsedHeader = JSON.parse(decoded);
  } catch {
    throw new RangeError("header segment is not valid JSON");
  }

  if (
    typeof parsedHeader !== "object" ||
    parsedHeader === null ||
    !Object.prototype.hasOwnProperty.call(parsedHeader, "alg")
  ) {
    if (typeof parsedHeader !== "object" || parsedHeader === null) {
      throw new RangeError("header must contain an 'alg' field");
    }
    throw new RangeError("header must contain an 'alg' field");
  }

  return {
    header: parsedHeader as Record<string, unknown>,
    payloadSegment,
    signature,
  };
}

export { validateJwtStructure };