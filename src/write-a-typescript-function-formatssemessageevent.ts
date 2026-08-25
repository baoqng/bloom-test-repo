// bloom-deps:

function formatSseMessage(event: unknown, data: unknown, id: unknown): string {
  if (typeof data !== "string") {
    throw new TypeError("data must be a string");
  }
  if (event !== null && typeof event !== "string") {
    throw new TypeError("event must be a string or null");
  }
  if (id !== null && typeof id !== "string") {
    throw new TypeError("id must be a string or null");
  }
  if (data.includes("\n") || data.includes("\r")) {
    throw new SyntaxError("data must not contain newlines");
  }

  let result = "";

  if (typeof event === "string" && event.length > 0) {
    result += `event: ${event}\n`;
  }

  if (typeof id === "string" && id.length > 0) {
    result += `id: ${id}\n`;
  }

  result += `data: ${data}\n\n`;

  return result;
}

export { formatSseMessage };