// bloom-deps:

function buildEndpointPath(base: unknown, segments: unknown): string {
  if (typeof base !== "string") {
    throw new TypeError("base must be a string");
  }
  if (!base.startsWith("/")) {
    throw new SyntaxError("base must start with '/'");
  }
  if (base.endsWith("/") && base !== "/") {
    throw new SyntaxError("base must not end with '/'");
  }
  if (!Array.isArray(segments)) {
    throw new TypeError("segments must be an array");
  }
  const encodedSegments: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (typeof segment !== "string") {
      throw new TypeError(`Segment at index ${i} must be a string`);
    }
    if (segment.trim() === "") {
      throw new SyntaxError(`Segment at index ${i} must not be empty`);
    }
    if (segment.includes("/")) {
      throw new SyntaxError(`Segment at index ${i} must not contain '/'`);
    }
    encodedSegments.push(encodeURIComponent(segment));
  }
  if (encodedSegments.length === 0) {
    return base;
  }
  const baseNormalized = base === "/" ? "" : base;
  return baseNormalized + "/" + encodedSegments.join("/");
}

export { buildEndpointPath };