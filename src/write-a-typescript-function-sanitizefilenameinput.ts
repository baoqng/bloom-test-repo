// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function sanitizeFilename(input: unknown, options: unknown = {}): string {
  // Validate input
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Validate options
  if (options !== undefined && options !== null && !isPlainObject(options)) {
    throw new TypeError('options must be a plain object');
  }

  const opts = (isPlainObject(options) ? options : {}) as Record<string, unknown>;

  // Extract and validate maxLength
  let maxLength = 255;
  if ('maxLength' in opts && opts['maxLength'] !== undefined) {
    const ml = opts['maxLength'];
    if (
      typeof ml !== 'number' ||
      !Number.isInteger(ml) ||
      ml <= 0
    ) {
      throw new TypeError('maxLength must be a positive integer');
    }
    maxLength = ml as number;
  }

  // Extract replacement
  let replacement = '-';
  if ('replacement' in opts && opts['replacement'] !== undefined) {
    replacement = opts['replacement'] as string;
  }

  // Replace any character that is not alphanumeric, dot, hyphen, or underscore
  let result = input.replace(/[^a-zA-Z0-9.\-_]/g, replacement);

  // Collapse consecutive replacement characters into one
  if (replacement.length > 0) {
    const escaped = replacement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const collapseRegex = new RegExp(`(${escaped}){2,}`, 'g');
    result = result.replace(collapseRegex, replacement);
  }

  // Trim leading and trailing replacement characters, dots, and whitespace
  const escapedReplacement = replacement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const trimChars = `\\s.${escapedReplacement}`;
  const trimRegex = new RegExp(`^[${trimChars}]+|[${trimChars}]+$`, 'g');
  result = result.replace(trimRegex, '');

  // Truncate to maxLength
  if (result.length > maxLength) {
    result = result.slice(0, maxLength);
  }

  // Check if empty after sanitization
  if (result.length === 0) {
    throw new RangeError('Sanitized filename is empty');
  }

  return result;
}