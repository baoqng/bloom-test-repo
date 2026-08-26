// bloom-deps:

export interface LogEntry {
  level: string;
  timestamp: string;
  message: string;
  fields: Record<string, string>;
}

const VALID_LEVELS = new Set(['DEBUG', 'INFO', 'WARN', 'ERROR']);
const TIMESTAMP_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

export function parseStructuredLog(line: unknown): LogEntry {
  if (typeof line !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof line}`);
  }

  // Parse level: must start with [LEVEL]
  if (!line.startsWith('[')) {
    throw new SyntaxError(`Log line must start with '[', got: ${line}`);
  }

  const closeBracket = line.indexOf(']');
  if (closeBracket === -1) {
    throw new SyntaxError(`Log line missing closing ']' for level bracket`);
  }

  const level = line.slice(1, closeBracket);
  if (!VALID_LEVELS.has(level)) {
    throw new SyntaxError(`Invalid log level: '${level}'. Must be one of DEBUG, INFO, WARN, ERROR`);
  }

  // After [LEVEL] there should be a space then the timestamp
  const afterLevel = line.slice(closeBracket + 1);
  if (!afterLevel.startsWith(' ')) {
    throw new SyntaxError(`Expected space after level bracket, got: ${afterLevel}`);
  }

  const rest = afterLevel.slice(1); // remove leading space

  // Extract timestamp (first token)
  const spaceAfterTimestamp = rest.indexOf(' ');
  let timestamp: string;
  let afterTimestamp: string;

  if (spaceAfterTimestamp === -1) {
    timestamp = rest;
    afterTimestamp = '';
  } else {
    timestamp = rest.slice(0, spaceAfterTimestamp);
    afterTimestamp = rest.slice(spaceAfterTimestamp + 1);
  }

  if (!TIMESTAMP_REGEX.test(timestamp)) {
    throw new SyntaxError(`Invalid timestamp: '${timestamp}'. Must match \\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z`);
  }

  // Parse the remainder: message followed by key=value pairs
  // key=value pairs are tokens that contain '=' with no spaces in key
  // We need to find where message ends and key=value pairs begin.
  // Strategy: split by spaces, scan from left; once we find a token matching key=value pattern, 
  // everything from that point on is key=value pairs.
  const KEY_VALUE_REGEX = /^[^=\s]+=.*$/;

  const tokens = afterTimestamp.length > 0 ? afterTimestamp.split(' ') : [];

  let firstKvIndex = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (KEY_VALUE_REGEX.test(tokens[i])) {
      firstKvIndex = i;
      break;
    }
  }

  let message: string;
  let kvTokens: string[];

  if (firstKvIndex === -1) {
    // No key=value pairs found
    message = afterTimestamp.trim();
    kvTokens = [];
  } else {
    message = tokens.slice(0, firstKvIndex).join(' ').trim();
    kvTokens = tokens.slice(firstKvIndex);
  }

  // Parse key=value pairs
  const fields: Record<string, string> = {};
  for (const token of kvTokens) {
    const eqIndex = token.indexOf('=');
    if (eqIndex === -1) {
      // Not a valid kv pair, could be part of value or stray token; skip
      continue;
    }
    const key = token.slice(0, eqIndex);
    const value = token.slice(eqIndex + 1);
    if (key.length > 0) {
      fields[key] = value;
    }
  }

  return {
    level,
    timestamp,
    message,
    fields,
  };
}