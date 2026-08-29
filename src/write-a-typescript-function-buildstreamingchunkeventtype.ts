// bloom-deps:

export function buildStreamingChunk(
  eventType: unknown,
  data: unknown,
  id: unknown
): string {
  // Validate eventType
  if (typeof eventType !== "string") {
    throw new TypeError("eventType must be a non-empty string");
  }
  if (eventType.length === 0) {
    throw new TypeError("eventType must be a non-empty string");
  }
  if (eventType.includes("\n") || eventType.includes("\r")) {
    throw new RangeError("eventType must not contain newlines");
  }

  // Validate data
  if (typeof data !== "string") {
    throw new TypeError("data must be a string");
  }

  // Validate id
  if (id !== null && typeof id !== "string") {
    throw new TypeError("id must be a string or null");
  }

  let message = "";

  // Field order: id (if present), event, data, followed by blank line
  if (id !== null) {
    message += `id: ${id}\n`;
  }

  message += `event: ${eventType}\n`;

  // Handle multi-line data
  const dataLines = data.split("\n");
  for (const line of dataLines) {
    message += `data: ${line}\n`;
  }

  // Always end with two newlines
  message += "\n";

  return message;
}