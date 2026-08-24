// bloom-deps:

function buildCacheControl(options: unknown): string {
  // Validate that options is a plain object (not null, not an array, not a primitive)
  if (
    options === null ||
    typeof options !== "object" ||
    Array.isArray(options)
  ) {
    throw new TypeError(
      "options must be a plain object"
    );
  }

  const opts = options as Record<string, unknown>;

  // Validate field types
  if ("maxAge" in opts) {
    if (typeof opts.maxAge !== "number") {
      throw new TypeError("maxAge must be a number");
    }
    // Check for non-integer, negative, NaN, or non-finite values
    if (
      !Number.isInteger(opts.maxAge) ||
      opts.maxAge < 0 ||
      !Number.isFinite(opts.maxAge)
    ) {
      throw new RangeError("maxAge must be a non-negative integer");
    }
  }

  if ("sMaxAge" in opts) {
    if (typeof opts.sMaxAge !== "number") {
      throw new TypeError("sMaxAge must be a number");
    }
    // Check for non-integer, negative, NaN, or non-finite values
    if (
      !Number.isInteger(opts.sMaxAge) ||
      opts.sMaxAge < 0 ||
      !Number.isFinite(opts.sMaxAge)
    ) {
      throw new RangeError("sMaxAge must be a non-negative integer");
    }
  }

  if ("noCache" in opts && typeof opts.noCache !== "boolean") {
    throw new TypeError("noCache must be a boolean");
  }

  if ("noStore" in opts && typeof opts.noStore !== "boolean") {
    throw new TypeError("noStore must be a boolean");
  }

  if ("mustRevalidate" in opts && typeof opts.mustRevalidate !== "boolean") {
    throw new TypeError("mustRevalidate must be a boolean");
  }

  if ("private" in opts && typeof opts.private !== "boolean") {
    throw new TypeError("private must be a boolean");
  }

  if ("public" in opts && typeof opts.public !== "boolean") {
    throw new TypeError("public must be a boolean");
  }

  // Check for conflicting private and public
  if (opts.private === true && opts.public === true) {
    throw new RangeError("private and public cannot both be true");
  }

  // Build directives in the specified order
  const directives: string[] = [];

  if (opts.noStore === true) {
    directives.push("no-store");
  }

  if (opts.noCache === true) {
    directives.push("no-cache");
  }

  if (opts.private === true) {
    directives.push("private");
  }

  if (opts.public === true) {
    directives.push("public");
  }

  if (opts.mustRevalidate === true) {
    directives.push("must-revalidate");
  }

  if ("maxAge" in opts && typeof opts.maxAge === "number") {
    directives.push(`max-age=${opts.maxAge}`);
  }

  if ("sMaxAge" in opts && typeof opts.sMaxAge === "number") {
    directives.push(`s-maxage=${opts.sMaxAge}`);
  }

  return directives.join(", ");
}

export { buildCacheControl };