// bloom-deps:

export interface ParsedLogLine {
  level: string;
  message: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export function parseLogLine(line: unknown): ParsedLogLine {
  if (line === null || typeof line !== 'object') {
    throw new TypeError('line must be a non-null object');
  }

  if (Array.isArray(line)) {
    throw new TypeError('line must not be an array');
  }

  const record = line as Record<string, unknown>;

  if (!('level' in record)) {
    throw new TypeError('level field is absent');
  }
  if (typeof record['level'] !== 'string') {
    throw new TypeError('level must be a string');
  }

  if (!('message' in record)) {
    throw new TypeError('message field is absent');
  }
  if (typeof record['message'] !== 'string') {
    throw new TypeError('message must be a string');
  }

  if (!('timestamp' in record)) {
    throw new TypeError('timestamp field is absent');
  }
  if (typeof record['timestamp'] !== 'string') {
    throw new TypeError('timestamp must be a string');
  }

  if (!('metadata' in record)) {
    throw new TypeError('metadata field is absent');
  }

  const metadata = record['metadata'];

  if (metadata === null) {
    throw new TypeError('metadata must not be null');
  }

  if (typeof metadata !== 'object') {
    throw new TypeError('metadata must be an object');
  }

  if (Array.isArray(metadata)) {
    throw new TypeError('metadata must not be an array');
  }

  return {
    level: record['level'] as string,
    message: record['message'] as string,
    timestamp: record['timestamp'] as string,
    metadata: metadata as Record<string, unknown>,
  };
}