// bloom-deps:

function decodeJwtSegment(segment: unknown): Record<string, unknown> {
  if (typeof segment !== "string") {
    throw new TypeError("Expected a string");
  }

  // Strip trailing '=' padding characters
  const stripped = segment.replace(/=+$/, "");

  // Validate that only base64url characters remain
  if (!/^[A-Za-z0-9_-]*$/.test(stripped)) {
    throw new SyntaxError("Invalid base64url encoding");
  }

  // Convert base64url to standard base64
  const base64 = stripped
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  // Add padding back
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

  // Decode base64 to string
  let decoded: string;
  try {
    decoded = Buffer.from(padded, "base64").toString("utf8");
  } catch {
    throw new SyntaxError("Invalid base64url encoding");
  }

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(decoded);
  } catch {
    throw new SyntaxError("Segment is not valid JSON");
  }

  // Ensure it's a plain object
  if (
    parsed === null ||
    typeof parsed !== "object" ||
    Array.isArray(parsed)
  ) {
    throw new SyntaxError("Segment must decode to an object");
  }

  return parsed as Record<string, unknown>;
}

export { decodeJwtSegment };