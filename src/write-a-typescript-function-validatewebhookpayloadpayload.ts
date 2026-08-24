// bloom-deps:

function validateWebhookPayload(payload: unknown): { event: string; timestamp: number; data: Record<string, unknown> } {
  // Validate that payload is a plain non-null object
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new TypeError('Payload must be a plain non-null object');
  }

  const payloadObj = payload as Record<string, unknown>;

  // Validate 'event' field
  if (!('event' in payloadObj)) {
    throw new RangeError('Field "event" is required');
  }

  const event = payloadObj.event;
  if (typeof event !== 'string' || event.length === 0) {
    throw new RangeError('Field "event" must be a non-empty string');
  }

  // Validate 'timestamp' field
  if (!('timestamp' in payloadObj)) {
    throw new RangeError('Field "timestamp" is required');
  }

  const timestamp = payloadObj.timestamp;
  if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) {
    throw new RangeError('Field "timestamp" must be a finite number');
  }

  if (!Number.isInteger(timestamp) || timestamp <= 0) {
    throw new RangeError('Field "timestamp" must be a positive integer');
  }

  // Validate 'data' field
  if (!('data' in payloadObj)) {
    throw new RangeError('Field "data" is required');
  }

  const data = payloadObj.data;
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new RangeError('Field "data" must be a plain non-null object');
  }

  // Return the entire validated payload object to preserve extra fields
  return payloadObj as { event: string; timestamp: number; data: Record<string, unknown> };
}

export { validateWebhookPayload };