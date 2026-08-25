// bloom-deps:

function formatSseMessage(event: unknown, data: unknown, id: unknown): string {
  if (typeof data !== 'string') {
    throw new TypeError('data must be a string');
  }

  if (event !== null && typeof event !== 'string') {
    throw new TypeError('event must be a string or null');
  }

  if (id !== null && typeof id !== 'string') {
    throw new TypeError('id must be a string or null');
  }

  if (data.includes('\n') || data.includes('\r')) {
    throw new SyntaxError('data must not contain newlines');
  }

  let message = '';

  if (typeof event === 'string' && event.length > 0) {
    message += `event: ${event}\n`;
  }

  if (typeof id === 'string' && id.length > 0) {
    message += `id: ${id}\n`;
  }

  message += `data: ${data}\n\n`;

  return message;
}

export { formatSseMessage };