// bloom-deps:

function validateWebhookPayload(payload: unknown): { event: string; timestamp: number; data: Record<string, unknown> } {
  // Input validation guard: payload must be a plain non-null object
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new TypeError('Payload must be a plain non-null object');
  }

  const obj = payload as Record<string, unknown>;

  // Validate 'event' field
  if (!('event' in obj)) {
    throw new RangeError('Field "event" is absent from payload');
  }

  const event = obj.event;
  if (typeof event !== 'string' || event.length === 0) {
    throw new RangeError('Field "event" must be a non-empty string');
  }

  // Validate 'timestamp' field
  if (!('timestamp' in obj)) {
    throw new RangeError('Field "timestamp" is absent from payload');
  }

  const timestamp = obj.timestamp;
  
  // Check if timestamp is a finite number
  if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) {
    throw new RangeError('Field "timestamp" must be a finite number');
  }

  // Check if timestamp is a positive integer
  if (!Number.isInteger(timestamp) || timestamp <= 0) {
    throw new RangeError('Field "timestamp" must be a positive integer');
  }

  // Validate 'data' field
  if (!('data' in obj)) {
    throw new RangeError('Field "data" is absent from payload');
  }

  const data = obj.data;
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new RangeError('Field "data" must be a plain non-null object');
  }

  // Return the entire payload object to pass through unknown fields
  return obj as { event: string; timestamp: number; data: Record<string, unknown> };
}

export { validateWebhookPayload };