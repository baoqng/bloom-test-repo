// bloom-deps:

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
const VALID_LEVELS: readonly string[] = ['debug', 'info', 'warn', 'error'];

function resolveLogLevel(level: unknown, defaultLevel: unknown): LogLevel {
  if (typeof defaultLevel !== 'string') {
    throw new TypeError('defaultLevel must be a string');
  }

  const normalizedDefault = defaultLevel.trim().toLowerCase();
  if (!VALID_LEVELS.includes(normalizedDefault)) {
    throw new RangeError('defaultLevel must be one of: debug, info, warn, error');
  }

  const validatedDefault = normalizedDefault as LogLevel;

  if (level === null || level === undefined) {
    return validatedDefault;
  }

  if (typeof level !== 'string') {
    throw new TypeError('level must be a string');
  }

  const normalizedLevel = level.trim().toLowerCase();
  if (!VALID_LEVELS.includes(normalizedLevel)) {
    return validatedDefault;
  }

  return normalizedLevel as LogLevel;
}

export { resolveLogLevel };