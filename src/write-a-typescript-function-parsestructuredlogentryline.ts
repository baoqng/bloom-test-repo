// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function parseStructuredLogEntry(line: unknown): {
  timestamp: Date;
  level: string;
  message: string;
  fields: Record<string, unknown>;
} {
  if (typeof line !== 'string' || line.length === 0) {
    throw new TypeError('Invalid log entry');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(line);
  } catch {
    throw new TypeError('Invalid log entry');
  }

  if (!isPlainObject(parsed)) {
    throw new TypeError('Invalid log entry');
  }

  const obj = parsed as Record<string, unknown>;

  // Validate timestamp
  if (typeof obj['timestamp'] !== 'string') {
    throw new TypeError('Invalid log entry');
  }
  const timestampDate = new Date(obj['timestamp'] as string);
  if (isNaN(timestampDate.getTime())) {
    throw new TypeError('Invalid log entry');
  }

  // Validate message
  if (typeof obj['message'] !== 'string' || (obj['message'] as string).length === 0) {
    throw new TypeError('Invalid log entry');
  }

  // Validate fields
  if (!isPlainObject(obj['fields'])) {
    throw new TypeError('Invalid log entry');
  }

  // Validate level (after other TypeError checks, throw RangeError for invalid level)
  if (typeof obj['level'] !== 'string') {
    throw new TypeError('Invalid log entry');
  }
  const validLevels = ['debug', 'info', 'warn', 'error'];
  if (!validLevels.includes(obj['level'] as string)) {
    throw new RangeError('Unknown log level');
  }

  return {
    timestamp: timestampDate,
    level: obj['level'] as string,
    message: obj['message'] as string,
    fields: obj['fields'] as Record<string, unknown>,
  };
}