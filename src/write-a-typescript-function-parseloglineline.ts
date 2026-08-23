// bloom-deps:

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ParsedLogLine {
  level: LogLevel;
  message: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
}

const VALID_LEVELS: ReadonlySet<string> = new Set(['debug', 'info', 'warn', 'error']);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function parseLogLine(line: unknown): ParsedLogLine {
  if (line === null || typeof line !== 'object' || Array.isArray(line)) {
    throw new TypeError('Invalid log line');
  }

  const obj = line as Record<string, unknown>;

  // Validate level
  const rawLevel = obj['level'];
  if (rawLevel === undefined || rawLevel === null || typeof rawLevel !== 'string' || !VALID_LEVELS.has(rawLevel)) {
    throw new TypeError('Invalid log line');
  }
  const level = rawLevel as LogLevel;

  // Validate message
  const rawMessage = obj['message'];
  if (rawMessage === undefined || rawMessage === null || typeof rawMessage !== 'string') {
    throw new TypeError('Invalid log line');
  }
  const message = rawMessage;

  // Validate timestamp
  const rawTimestamp = obj['timestamp'];
  if (rawTimestamp === undefined || rawTimestamp === null) {
    throw new TypeError('Invalid log line');
  }

  let timestamp: Date;
  if (rawTimestamp instanceof Date) {
    timestamp = rawTimestamp;
  } else if (typeof rawTimestamp === 'string') {
    const parsed = new Date(rawTimestamp);
    if (isNaN(parsed.getTime())) {
      throw new TypeError('Invalid log line');
    }
    timestamp = parsed;
  } else {
    throw new TypeError('Invalid log line');
  }

  // Validate metadata
  let metadata: Record<string, unknown> = {};
  if (Object.prototype.hasOwnProperty.call(obj, 'metadata')) {
    const rawMetadata = obj['metadata'];
    if (rawMetadata === undefined) {
      metadata = {};
    } else if (!isPlainObject(rawMetadata)) {
      throw new TypeError('Invalid log line');
    } else {
      metadata = rawMetadata;
    }
  }

  return { level, message, timestamp, metadata };
}