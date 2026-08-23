// bloom-deps:

export function parseLogLine(line: unknown): {
  timestamp: Date;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  service: string;
  message: string;
  fields: Record<string, string>;
} {
  if (typeof line !== 'string') {
    throw new TypeError('line must be a string');
  }

  // Format: [ISO_TIMESTAMP] LEVEL [service] message {key=value}
  // Use a regex to parse the structure
  const pattern = /^\[([^\]]+)\]\s+(\S+)\s+\[([^\]]*)\]\s*(.*?)(?:\s*\{(.*)\})?\s*$/s;
  const match = line.match(pattern);

  if (!match) {
    throw new SyntaxError('Invalid log line format');
  }

  const [, timestampStr, levelStr, serviceRaw, rest] = match;
  const fieldsBlockStr = match[5];

  // Validate timestamp
  const timestampDate = new Date(timestampStr);
  if (isNaN(timestampDate.getTime())) {
    throw new RangeError('Invalid timestamp');
  }

  // Validate level
  const validLevels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'] as const;
  if (!validLevels.includes(levelStr as typeof validLevels[number])) {
    throw new SyntaxError(`Unknown log level: ${levelStr}`);
  }
  const level = levelStr as 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

  // Service name
  const service = serviceRaw.trim();

  // Message
  const message = rest.trim();

  // Fields
  const fields: Record<string, string> = {};

  if (fieldsBlockStr !== undefined && fieldsBlockStr.trim().length > 0) {
    parseFields(fieldsBlockStr.trim(), fields);
  }

  return {
    timestamp: timestampDate,
    level,
    service,
    message,
    fields,
  };
}

function parseFields(input: string, fields: Record<string, string>): void {
  let i = 0;

  while (i < input.length) {
    // Skip whitespace
    while (i < input.length && /\s/.test(input[i])) {
      i++;
    }

    if (i >= input.length) break;

    // Read key
    let key = '';
    while (i < input.length && input[i] !== '=' && !/\s/.test(input[i])) {
      key += input[i];
      i++;
    }

    if (!key) {
      i++;
      continue;
    }

    if (i >= input.length || input[i] !== '=') {
      // No value, skip
      continue;
    }

    // Skip '='
    i++;

    // Read value
    let value = '';
    if (i < input.length && input[i] === '"') {
      // Quoted value
      i++; // skip opening quote
      while (i < input.length) {
        if (input[i] === '\\' && i + 1 < input.length && input[i + 1] === '"') {
          value += '"';
          i += 2;
        } else if (input[i] === '"') {
          i++; // skip closing quote
          break;
        } else {
          value += input[i];
          i++;
        }
      }
    } else {
      // Unquoted token
      while (i < input.length && !/\s/.test(input[i])) {
        value += input[i];
        i++;
      }
    }

    fields[key] = value;
  }
}