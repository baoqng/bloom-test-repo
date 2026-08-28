// bloom-deps:

export function parseHttpStatusLine(input: unknown): {
  version: string;
  statusCode: number;
  reasonPhrase: string;
} {
  // Validate input is a non-empty string
  if (typeof input !== "string" || input.length === 0) {
    throw new TypeError("input must be a non-empty string");
  }

  // Find first space to split version from status code and reason
  const firstSpaceIdx = input.indexOf(" ");
  if (firstSpaceIdx === -1) {
    throw new SyntaxError("Not a valid HTTP status line");
  }

  const versionPart = input.slice(0, firstSpaceIdx);

  // Validate version format: HTTP/X.Y where X and Y are single digits
  if (!/^HTTP\/\d\.\d$/.test(versionPart)) {
    throw new SyntaxError("Not a valid HTTP status line");
  }

  // Extract X and Y to verify they are single digits
  const dotIdx = versionPart.indexOf(".");
  if (dotIdx === -1) {
    throw new SyntaxError("Not a valid HTTP status line");
  }

  const majorVersion = versionPart.slice(5, dotIdx);
  const minorVersion = versionPart.slice(dotIdx + 1);

  if (majorVersion.length !== 1 || minorVersion.length !== 1) {
    throw new SyntaxError("Not a valid HTTP status line");
  }

  if (!/^\d$/.test(majorVersion) || !/^\d$/.test(minorVersion)) {
    throw new SyntaxError("Not a valid HTTP status line");
  }

  // Extract status code and reason phrase from the rest
  const rest = input.slice(firstSpaceIdx + 1);

  // Find the second space to separate status code from reason phrase
  const secondSpaceIdx = rest.indexOf(" ");
  let statusCodePart: string;
  let reasonPhrasePart: string;

  if (secondSpaceIdx === -1) {
    // No reason phrase
    statusCodePart = rest;
    reasonPhrasePart = "";
  } else {
    statusCodePart = rest.slice(0, secondSpaceIdx);
    reasonPhrasePart = rest.slice(secondSpaceIdx + 1);
  }

  // Validate status code is exactly 3 digits
  if (!/^\d{3}$/.test(statusCodePart)) {
    throw new SyntaxError("Not a valid HTTP status line");
  }

  const statusCode = parseInt(statusCodePart, 10);

  // Validate status code is in range 100-599
  if (statusCode < 100 || statusCode > 599) {
    throw new SyntaxError("Not a valid HTTP status line");
  }

  // Validate reason phrase is not empty
  if (reasonPhrasePart.length === 0) {
    throw new SyntaxError("Not a valid HTTP status line");
  }

  // Trim reason phrase
  const trimmedReasonPhrase = reasonPhrasePart.trim();

  // Validate trimmed reason phrase is not empty
  if (trimmedReasonPhrase.length === 0) {
    throw new SyntaxError("Not a valid HTTP status line");
  }

  // Validate reason phrase contains only printable ASCII characters
  // Printable ASCII is 0x20-0x7E (space to tilde)
  for (let i = 0; i < trimmedReasonPhrase.length; i++) {
    const charCode = trimmedReasonPhrase.charCodeAt(i);
    if (charCode < 0x20 || charCode > 0x7e) {
      throw new SyntaxError("Not a valid HTTP status line");
    }
  }

  return {
    version: versionPart,
    statusCode,
    reasonPhrase: trimmedReasonPhrase,
  };
}