// bloom-deps:

function buildSseEvent(event: unknown, data: unknown, id?: unknown, retry?: unknown): string {
  // Validate event type
  if (typeof event !== 'string') {
    throw new TypeError('event must be a string');
  }

  // Validate data type
  if (typeof data !== 'string') {
    throw new TypeError('data must be a string');
  }

  // Validate event not empty/whitespace
  if (!event.trim()) {
    throw new RangeError('event must not be empty');
  }

  // Validate data not empty/whitespace
  if (!data.trim()) {
    throw new RangeError('data must not be empty');
  }

  // Validate id if provided
  if (id !== undefined) {
    if (typeof id !== 'string') {
      throw new TypeError('id must be a string');
    }
    if (!id.trim()) {
      throw new RangeError('id must not be empty');
    }
    if (/[\n\r]/.test(id)) {
      throw new SyntaxError('id must not contain newline characters');
    }
  }

  // Validate retry if provided
  if (retry !== undefined) {
    if (typeof retry !== 'number') {
      throw new TypeError('retry must be a number');
    }
    if (!Number.isFinite(retry) || !Number.isInteger(retry) || retry <= 0) {
      throw new RangeError('retry must be a positive finite integer');
    }
  }

  // Build the SSE event string
  let result = '';

  // Emit event line
  result += 'event: ' + event.trim() + '\n';

  // Emit data lines, splitting on \n
  const dataParts = data.split('\n');
  for (const part of dataParts) {
    result += 'data: ' + part + '\n';
  }

  // Emit id line if provided
  if (id !== undefined) {
    result += 'id: ' + (id as string).trim() + '\n';
  }

  // Emit retry line if provided
  if (retry !== undefined) {
    result += 'retry: ' + retry + '\n';
  }

  // Terminate the event with a final newline
  result += '\n';

  return result;
}

export { buildSseEvent };