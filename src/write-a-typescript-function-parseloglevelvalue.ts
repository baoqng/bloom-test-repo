// bloom-deps:

function parseLogLevel(value: unknown): 'debug' | 'info' | 'warn' | 'error' {
  // Validate that input is a string
  if (typeof value !== 'string') {
    throw new TypeError(`Log level must be a string, received ${typeof value}`);
  }

  // Validate maxLength for string input
  if (value.length > 100) {
    throw new TypeError('Log level string exceeds maximum length');
  }

  // Normalize to lowercase
  const normalized = value.toLowerCase();

  // Validate that normalized value is one of the four valid levels
  const validLevels = ['debug', 'info', 'warn', 'error'] as const;
  if (!validLevels.includes(normalized as 'debug' | 'info' | 'warn' | 'error')) {
    throw new RangeError(
      `Invalid log level: "${value}". Must be one of: debug, info, warn, error`
    );
  }

  return normalized as 'debug' | 'info' | 'warn' | 'error';
}

export { parseLogLevel };