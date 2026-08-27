export function validatePemBlock(pem: unknown): { type: string; body: string } {
  // Step 1: type check
  if (typeof pem !== "string") {
    throw new TypeError("pem must be a string");
  }

  // Step 2: empty/whitespace check
  if (!pem.trim()) {
    throw new RangeError("pem must not be empty");
  }

  // Trim the string
  const trimmed = pem.trim();

  // Step 3: must start with '-----BEGIN '
  if (!trimmed.startsWith("-----BEGIN ")) {
    throw new RangeError("pem must start with '-----BEGIN '");
  }

  // Step 4: must end with '-----'
  if (!trimmed.endsWith("-----")) {
    throw new RangeError("pem must end with '-----'");
  }

  // Split into lines
  const lines = trimmed.split(/\r?\n/);

  // Extract type from BEGIN line
  const beginLine = lines[0].trim();
  // beginLine should be like: -----BEGIN CERTIFICATE-----
  const beginPrefix = "-----BEGIN ";
  const beginSuffix = "-----";

  if (!beginLine.startsWith(beginPrefix)) {
    throw new RangeError("pem BEGIN line is malformed");
  }

  const afterBeginPrefix = beginLine.slice(beginPrefix.length);
  const beginClosingIdx = afterBeginPrefix.indexOf(beginSuffix);
  if (beginClosingIdx === -1) {
    throw new RangeError("pem BEGIN line is malformed");
  }

  const type = afterBeginPrefix.slice(0, beginClosingIdx);

  // First, search for any valid END line format (regardless of type)
  const endPrefix = "-----END ";
  let endLineIndex = -1;
  let foundEndLineWithDifferentType = false;
  let differentEndType = "";

  for (let i = lines.length - 1; i >= 1; i--) {
    const trimmedLine = lines[i].trim();
    if (trimmedLine.startsWith(endPrefix)) {
      const afterEndPrefix = trimmedLine.slice(endPrefix.length);
      const endClosingIdx = afterEndPrefix.indexOf("-----");
      if (endClosingIdx !== -1) {
        const endType = afterEndPrefix.slice(0, endClosingIdx);
        if (endType === type) {
          endLineIndex = i;
          break;
        } else if (!foundEndLineWithDifferentType) {
          foundEndLineWithDifferentType = true;
          differentEndType = endType;
        }
      }
    }
  }

  // If we found an END line with a different type, throw type mismatch first
  if (endLineIndex === -1 && foundEndLineWithDifferentType) {
    throw new RangeError("pem BEGIN and END types must match");
  }

  if (endLineIndex === -1) {
    throw new RangeError("pem END line is malformed");
  }

  // Extract END type to verify match
  const endLine = lines[endLineIndex].trim();
  const afterEndPrefix = endLine.slice(endPrefix.length);
  const endClosingIdx = afterEndPrefix.indexOf("-----");
  if (endClosingIdx === -1) {
    throw new RangeError("pem END line is malformed");
  }
  const endType = afterEndPrefix.slice(0, endClosingIdx);

  // Step 5: types must match
  if (type !== endType) {
    throw new RangeError("pem BEGIN and END types must match");
  }

  // Extract body lines (between BEGIN and END)
  const bodyLines = lines.slice(1, endLineIndex);

  // Strip all whitespace from body
  const body = bodyLines.join("").replace(/\s/g, "");

  // Validate base64 characters
  if (body.length > 0 && /[^A-Za-z0-9+/=]/.test(body)) {
    throw new RangeError("pem body must contain only base64 characters");
  }

  return { type, body };
}