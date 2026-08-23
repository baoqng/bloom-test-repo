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
  // The regex matches:
  // 1. [ISO_TIMESTAMP] - brackets with timestamp
  // 2. LEVEL - the log level
  // 3. [service] - brackets with service name
  // 4. message - optional message text
  // 5. {fields} - optional fields block
  const pattern = /^\[([^\]]+)\]\s+(\S+)\s+\[([^\]]*)\](.*?)(\{[^}]*\})?\s*$/s;
  const match = line.match(pattern);

  if (!match) {
    throw new SyntaxError('Invalid log line format');
  }

  const [, timestampStr, levelStr, serviceRaw, messageRaw, fieldsRaw] = match;

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

  // Message (trimmed)
  const message = messageRaw.trim();

  // Parse fields
  const fields: Record<string, string> = {};

  if (fieldsRaw) {
    // Strip outer braces
    const inner = fieldsRaw.slice(1, -1).trim();

    if (inner.length > 0) {
      // Parse space-separated key=value pairs
      // value is either unquoted token or double-quoted string
      let pos = 0;

      while (pos < inner.length) {
        // Skip whitespace
        while (pos < inner.length && inner[pos] === ' ') {
          pos++;
        }

        if (pos >= inner.length) break;

        // Find key
        const eqIdx = inner.indexOf('=', pos);
        if (eqIdx === -1) break;

        const key = inner.slice(pos, eqIdx);
        pos = eqIdx + 1;

        if (pos >= inner.length) {
          fields[key] = '';
          break;
        }

        let value: string;

        if (inner[pos] === '"') {
          // Quoted string: find closing quote, respecting backslash escapes
          pos++; // skip opening quote
          let buf = '';
          while (pos < inner.length) {
            const ch = inner[pos];
            if (ch === '\\' && pos + 1 < inner.length && inner[pos + 1] === '"') {
              buf += '"';
              pos += 2;
            } else if (ch === '"') {
              pos++; // skip closing quote
              break;
            } else {
              buf += ch;
              pos++;
            }
          }
          value = buf;
        } else {
          // Unquoted token: read until whitespace
          const start = pos;
          while (pos < inner.length && inner[pos] !== ' ') {
            pos++;
          }
          value = inner.slice(start, pos);
        }

        fields[key] = value;
      }
    }
  }

  return { timestamp, level, service, message, fields };
}