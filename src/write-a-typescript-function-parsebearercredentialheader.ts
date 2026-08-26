// bloom-deps:

export function parseBearerCredential(header: unknown): string {
  if (typeof header !== "string") {
    throw new TypeError("header must be a string");
  }

  if (header.trim() === "") {
    throw new RangeError("header must not be empty");
  }

  if (!header.trimStart().startsWith("Bearer ")) {
    throw new RangeError("header must use Bearer scheme");
  }

  const token = header.slice(header.indexOf("Bearer ") + "Bearer ".length).trim();

  if (token === "") {
    throw new RangeError("token must not be empty");
  }

  if (/\s/.test(token)) {
    throw new RangeError("token must not contain whitespace");
  }

  return token;
}