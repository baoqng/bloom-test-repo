// bloom-deps:

export function validatePemBlock(pem: unknown): { type: string; body: string } {
  if (typeof pem !== "string") {
    throw new TypeError("pem must be a string");
  }

  if (!pem.trim()) {
    throw new RangeError("pem must not be empty");
  }

  const trimmed = pem.replace(/^\s+/, '').replace(/\s+$/, '');

  if (!trimmed.startsWith("-----BEGIN ")) {
    throw new RangeError("pem must start with '-----BEGIN '");
  }

  if (!trimmed.endsWith("-----")) {
    throw new RangeError("pem must end with '-----'");
  }

  const lines = trimmed.split(/\r?\n/);

  const beginLine = lines[0];
  const afterBegin = beginLine.slice("-----BEGIN ".length);
  const beginCloseIdx = afterBegin.indexOf("-----");
  if (beginCloseIdx === -1) {
    throw new RangeError("pem BEGIN line is malformed");
  }

  const type = afterBegin.slice(0, beginCloseIdx);

  const expectedEndLine = `-----END ${type}-----`;
  const endLineIdx = lines.findIndex((line) => line.trim() === expectedEndLine);
  if (endLineIdx === -1) {
    throw new RangeError("pem BEGIN and END types must match");
  }

  const endLine = lines[endLineIdx];
  const afterEnd = endLine.slice("-----END ".length);
  const endCloseIdx = afterEnd.indexOf("-----");
  const endType = afterEnd.slice(0, endCloseIdx);

  if (type !== endType) {
    throw new RangeError("pem BEGIN and END types must match");
  }

  const bodyLines = lines.slice(1, endLineIdx);
  const rawBody = bodyLines.join("");
  const body = rawBody.replace(/[\s]/g, "");

  if (!/^[A-Za-z0-9+/=]*$/.test(body)) {
    throw new RangeError("pem body must contain only base64 characters");
  }

  return { type, body };
}