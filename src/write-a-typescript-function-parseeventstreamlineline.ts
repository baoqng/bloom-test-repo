// bloom-deps:

export function parseEventStreamLine(line: unknown): { field: string; value: string } | null {
  if (typeof line !== 'string') {
    throw new TypeError('line must be a string');
  }

  if (line.trim().length === 0) {
    return null;
  }

  if (line.startsWith(':')) {
    return null;
  }

  const colonIndex = line.indexOf(':');

  let field: string;
  let value: string;

  if (colonIndex !== -1) {
    field = line.substring(0, colonIndex).trim();
    const afterColon = line.substring(colonIndex + 1);
    value = afterColon.startsWith(' ') ? afterColon.substring(1) : afterColon;
  } else {
    field = line.trim();
    value = '';
  }

  if (field === '') {
    throw new RangeError('field must not be empty');
  }

  return { field, value };
}