// bloom-deps:

function resolveApiVersion(header: string | null, supported: string[]): string {
  // Validate supported array
  if (
    !Array.isArray(supported) ||
    supported.length === 0 ||
    !supported.every((item) => typeof item === "string" && item.length > 0)
  ) {
    throw new TypeError(
      "supported must be a non-empty array of non-empty strings"
    );
  }

  // If header is null or empty after trimming, return last element
  if (header === null || header.trim().length === 0) {
    return supported[supported.length - 1];
  }

  // Trim the header
  const trimmedHeader = header.trim();

  // Strip leading 'v' or 'V' prefix
  let stripped = trimmedHeader;
  if (stripped.length > 0 && (stripped[0] === "v" || stripped[0] === "V")) {
    stripped = stripped.slice(1);
  }

  // Check if stripped value matches an element in supported (case-sensitive)
  if (supported.includes(stripped)) {
    return stripped;
  }

  // If header is non-empty but not in supported, throw RangeError
  throw new RangeError("Unsupported API version: " + header);
}

export { resolveApiVersion };