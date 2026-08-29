// bloom-deps:

function validateJwtStructure(token: unknown): {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
} {
  // Validate token is a non-empty string
  if (typeof token !== "string" || token.length === 0) {
    throw new TypeError("token must be a non-empty string");
  }

  // Count delimiter occurrences explicitly
  let dotCount = 0;
  let lastIndex = -1;
  while (true) {
    const index = token.indexOf(".", lastIndex + 1);
    if (index === -1) break;
    dotCount++;
    lastIndex = index;
  }

  // JWT must have exactly three dot-separated parts (two dots)
  if (dotCount !== 2) {
    throw new SyntaxError("JWT must have exactly three dot-separated parts");
  }

  // Split on first dot to get header
  const firstDotIndex = token.indexOf(".");
  const headerPart = token.slice(0, firstDotIndex);

  // Split on second dot to get payload
  const secondDotIndex = token.indexOf(".", firstDotIndex + 1);
  const payloadPart = token.slice(firstDotIndex + 1, secondDotIndex);

  // Get signature (everything after second dot)
  const signaturePart = token.slice(secondDotIndex + 1);

  // Decode and parse header
  let header: Record<string, unknown>;
  try {
    const headerJson = base64urlDecode(headerPart);
    header = JSON.parse(headerJson);
    
    // Validate header is a plain object
    if (!isPlainObject(header)) {
      throw new SyntaxError("JWT header is not valid base64url JSON");
    }
  } catch (error) {
    throw new SyntaxError("JWT header is not valid base64url JSON");
  }

  // Validate header has alg field
  if (!("alg" in header)) {
    throw new SyntaxError("JWT header must contain alg field");
  }

  // Decode and parse payload
  let payload: Record<string, unknown>;
  try {
    const payloadJson = base64urlDecode(payloadPart);
    payload = JSON.parse(payloadJson);
    
    // Validate payload is a plain object
    if (!isPlainObject(payload)) {
      throw new SyntaxError("JWT payload is not valid base64url JSON");
    }
  } catch (error) {
    throw new SyntaxError("JWT payload is not valid base64url JSON");
  }

  return {
    header,
    payload,
    signature: signaturePart,
  };
}

function base64urlDecode(input: string): string {
  // Add padding if necessary
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");

  // Check for valid base64url padding
  const paddingLength = base64.length % 4;
  if (paddingLength !== 0) {
    base64 += "=".repeat(4 - paddingLength);
  }

  try {
    return Buffer.from(base64, "base64").toString("utf-8");
  } catch {
    throw new Error("Invalid base64url");
  }
}

function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  // All four checks required: null, typeof, Array, getPrototypeOf
  if (obj === null) return false;
  if (typeof obj !== "object") return false;
  if (Array.isArray(obj)) return false;

  // Walk the full prototype chain
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    } else {
      break;
    }
  }

  return Object.getPrototypeOf(obj) === Object.prototype || Object.getPrototypeOf(obj) === null;
}

export { validateJwtStructure };