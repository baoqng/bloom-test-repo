// bloom-deps:

function extractSubdomain(hostname: unknown): string | null {
  if (typeof hostname !== "string") {
    throw new TypeError("hostname must be a string");
  }

  // Validate characters: only [a-zA-Z0-9.-] allowed
  if (/[^a-zA-Z0-9.\-]/.test(hostname)) {
    throw new SyntaxError("Invalid hostname");
  }

  // Validate no leading/trailing dot or hyphen
  if (/^[.\-]|[.\-]$/.test(hostname)) {
    throw new SyntaxError("Invalid hostname");
  }

  // Validate no consecutive dots
  if (/\.\./.test(hostname)) {
    throw new SyntaxError("Invalid hostname");
  }

  const labels = hostname.split(".");

  if (labels.length < 3) {
    return null;
  }

  return labels.slice(0, labels.length - 2).join(".");
}

export { extractSubdomain };