// bloom-deps:

export function validatePemBlock(pem: unknown): { type: string; body: string } {
  // Step 1: type check
  if (typeof pem !== "string") {
    throw new TypeError("pem must be a string");
  }

  // Step 2: empty/whitespace check
  if (!pem.trim()) {
    throw new RangeError("pem must not be empty");
  }

  // Step 3: trim only leading whitespace
  const trimmed = pem.replace(/^\s+/, '').replace(/\s+$/, '');

  // Step 4: structural constraints - start/end
  if (!trimmed.startsWith("-----BEGIN ")) {
    throw new RangeError("pem must start with '-----BEGIN '");
  }

  if (!trimmed.endsWith("-----")) {
    throw new RangeError("pem must end with '-----'");
  }

  // Split into lines
  const lines = trimmed.split(/\r?\n/);

  // Trim each line for comparison
  const trimmedLines = lines.map((line) => line.trim());

  // Step 5: Extract type from BEGIN line
  const beginLine = trimmedLines[0];
  // beginLine starts with '-----BEGIN '
  const afterBegin = beginLine.slice("-----BEGIN ".length);
  const beginClosingIdx = afterBegin.indexOf("-----");
  if (beginClosingIdx === -1) {
    throw new RangeError("pem BEGIN line is malformed");
  }
  const type = afterBegin.slice(0, beginClosingIdx);

  // Step 6: Find END line
  const expectedEndLine = `-----END ${type}-----`;
  let endLineIdx = -1;
  for (let i = trimmedLines.length - 1; i >= 1; i--) {
    if (trimmedLines[i] === expectedEndLine) {
      endLineIdx = i;
      break;
    }
  }

  if (endLineIdx === -1) {
    // Check if there's an END line at all with a different type
    let hasEndLine = false;
    for (let i = trimmedLines.length - 1; i >= 1; i--) {
      if (trimmedLines[i].startsWith("-----END ") && trimmedLines[i].endsWith("-----")) {
        hasEndLine = true;
        // Extract the type from this END line
        const afterEnd = trimmedLines[i].slice("-----END ".length);
        const endClosingIdx = afterEnd.indexOf("-----");
        if (endClosingIdx !== -1) {
          const endType = afterEnd.slice(0, endClosingIdx);
          if (endType !== type) {
            throw new RangeError("pem BEGIN and END types must match");
          }
        }
        break;
      }
    }
    throw new RangeError("pem END line is malformed");
  }

  // Extract END type to verify match
  const endLine = trimmedLines[endLineIdx];
  const afterEnd = endLine.slice("-----END ".length);
  const endClosingIdx = afterEnd.indexOf("-----");
  if (endClosingIdx === -1) {
    throw new RangeError("pem END line is malformed");
  }
  const endType = afterEnd.slice(0, endClosingIdx);

  // Step 7: type mismatch check
  if (type !== endType) {
    throw new RangeError("pem BEGIN and END types must match");
  }

  // Step 8: Extract body lines (between BEGIN and END lines)
  const bodyLines = trimmedLines.slice(1, endLineIdx);
  const rawBody = bodyLines.join("");

  // Strip all whitespace (spaces, tabs, newlines)
  const body = rawBody.replace(/\s/g, "");

  // Step 9: Validate base64 characters
  if (body.length > 0 && !/^[A-Za-z0-9+/=]+$/.test(body)) {
    throw new RangeError("pem body must contain only base64 characters");
  }

  return { type, body };
}