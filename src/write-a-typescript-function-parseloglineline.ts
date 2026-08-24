// bloom-deps:

interface ParsedLogLine {
  level: string;
  message: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export function parseLogLine(line: unknown): ParsedLogLine {
  if (typeof line !== 'string') {
    throw new TypeError('line must be a string');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(line);
  } catch (err) {
    throw new TypeError('line is not valid JSON', { cause: err });
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new TypeError('parsed value must be a non-null object');
  }

  const obj = parsed as Record<string, unknown>;

  if (!('level' in obj)) {
    throw new TypeError('missing required field: level');
  }
  if (!('message' in obj)) {
    throw new TypeError('missing required field: message');
  }
  if (!('timestamp' in obj)) {
    throw new TypeError('missing required field: timestamp');
  }
  if (!('metadata' in obj)) {
    throw new TypeError('missing required field: metadata');
  }

  const { level, message, timestamp, metadata } = obj;

  if (typeof level !== 'string') {
    throw new TypeError('field "level" must be a string');
  }
  if (level.length === 0) {
    throw new TypeError('field "level" must be a non-empty string');
  }

  if (typeof message !== 'string') {
    throw new TypeError('field "message" must be a string');
  }

  if (typeof timestamp !== 'string') {
    throw new TypeError('field "timestamp" must be a string');
  }
  const parsedDate = new Date(timestamp);
  if (isNaN(parsedDate.getTime())) {
    throw new TypeError('field "timestamp" must be a valid ISO 8601 date-time string');
  }

  if (metadata === null || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new TypeError('field "metadata" must be a non-null plain object');
  }

  return {
    level,
    message,
    timestamp,
    metadata: metadata as Record<string, unknown>,
  };
}