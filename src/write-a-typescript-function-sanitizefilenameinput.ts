// bloom-deps:

export function sanitizeFilename(input: unknown, maxLength?: number): string {
  const effectiveMaxLength = maxLength !== undefined ? maxLength : 255;

  if (maxLength !== undefined) {
    if (!Number.isInteger(effectiveMaxLength) || effectiveMaxLength <= 0) {
      throw new RangeError('maxLength must be a positive integer');
    }
  }

  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Step 1: replace any character that is not alphanumeric, hyphen, underscore, or period with an underscore
  let result = input.replace(/[^a-zA-Z0-9\-_.]/g, '_');

  // Step 2: collapse consecutive underscores to a single underscore
  result = result.replace(/_+/g, '_');

  // Step 3: strip leading and trailing underscores and periods
  result = result.replace(/^[_.]+|[_.]+$/g, '');

  // Step 4: truncate to maxLength characters
  result = result.slice(0, effectiveMaxLength);

  if (result.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  return result;
}