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
  const fieldsStr = match[5];

  // Validate timestamp
  const timestampMs = Date.parse(timestampStr);
  if (isNaN(timestampMs)) {
    throw new RangeError('Invalid timestamp');
  }
  const timestamp = new Date(timestampMs);

  // Validate level
  const validLevels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'] as const;
  if (!validLevels.includes(levelStr as (typeof validLevels)[number])) {
    throw new SyntaxError(`Unknown log level: ${levelStr}`);
  }
  const level = levelStr as 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

  // Service name (trimmed)
  const service = serviceRaw.trim();

  // Message: rest trimmed (rest is everything between closing service bracket and optional fields block)
  const message = rest.trim();

  // Parse fields
  const fields: Record<string, string> = {};
  if (fieldsStr !== undefined && fieldsStr.trim().length > 0) {
    parseFields(fieldsStr.trim(), fields);
  }

  return { timestamp, level, service, message, fields };
}

function parseFields(input: string, fields: Record<string, string>): void {
  let i = 0;
  const len = input.length;

  while (i < len) {
    // Skip whitespace
    while (i < len && /\s/.test(input[i])) i++;
    if (i >= len) break;

    // Read key
    let keyStart = i;
    while (i < len && input[i] !== '=' && !/\s/.test(input[i])) i++;
    const key = input.slice(keyStart, i);

    if (!key) {
      i++;
      continue;
    }

    // Expect '='
    if (i >= len || input[i] !== '=') {
      // No value, skip
      continue;
    }
    i++; // consume '='

    // Read value
    let value: string;
    if (i < len && input[i] === '"') {
      // Quoted string
      i++; // consume opening quote
      let valueChars: string[] = [];
      while (i < len) {
        if (input[i] === '\\' && i + 1 < len && input[i + 1] === '"') {
          valueChars.push('"');
          i += 2;
        } else if (input[i] === '"') {
          i++; // consume closing quote
          break;
        } else {
          valueChars.push(input[i]);
          i++;
        }
      }
      value = valueChars.join('');
    } else {
      // Unquoted token
      let valueStart = i;
      while (i < len && !/\s/.test(input[i])) i++;
      value = input.slice(valueStart, i);
    }

    if (key) {
      fields[key] = value;
    }
  }
}