// bloom-deps:

function resolveLogLevel(level: unknown, defaultLevel: unknown): 'debug' | 'info' | 'warn' | 'error' {
  const validLevels = ['debug', 'info', 'warn', 'error'] as const;
  type LogLevel = typeof validLevels[number];

  if (typeof defaultLevel !== 'string') {
    throw new TypeError('defaultLevel must be a string');
  }

  const normalizedDefault = defaultLevel.trim().toLowerCase();
  if (!(validLevels as readonly string[]).includes(normalizedDefault)) {
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
  if (!(validLevels as readonly string[]).includes(normalizedLevel)) {
    return validatedDefault;
  }

  return normalizedLevel as LogLevel;
}

export { resolveLogLevel };