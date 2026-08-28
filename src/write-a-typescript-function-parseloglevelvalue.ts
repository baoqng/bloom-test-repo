// bloom-deps:

function parseLogLevel(value: unknown): 'debug' | 'info' | 'warn' | 'error' {
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }

  const lower = value.toLowerCase();

  if (lower !== 'debug' && lower !== 'info' && lower !== 'warn' && lower !== 'error') {
    throw new RangeError(`invalid log level: "${value}"`);
  }

  return lower as 'debug' | 'info' | 'warn' | 'error';
}

export { parseLogLevel };