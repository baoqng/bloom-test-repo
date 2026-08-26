// bloom-deps:

export interface EventField {
  field: 'data' | 'event' | 'id' | 'retry';
  value: string;
}

const VALID_FIELDS = new Set<string>(['data', 'event', 'id', 'retry']);

export function parseEventSourceLine(line: unknown): EventField | null {
  if (typeof line !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof line}`);
  }

  if (line === '') {
    return null;
  }

  if (line.startsWith(':')) {
    return null;
  }

  const colonIndex = line.indexOf(':');

  if (colonIndex === -1) {
    // No colon at all — treat the whole line as a field name with empty value
    const fieldName = line;
    if (!VALID_FIELDS.has(fieldName)) {
      throw new SyntaxError(`Invalid field name: "${fieldName}"`);
    }
    return { field: fieldName as EventField['field'], value: '' };
  }

  const fieldName = line.slice(0, colonIndex);
  const rest = line.slice(colonIndex + 1);

  if (!VALID_FIELDS.has(fieldName)) {
    throw new SyntaxError(`Invalid field name: "${fieldName}"`);
  }

  // If there's a space after the colon, strip exactly one leading space
  let value: string;
  if (rest.startsWith(' ')) {
    value = rest.slice(1);
  } else {
    value = rest;
  }

  return { field: fieldName as EventField['field'], value };
}