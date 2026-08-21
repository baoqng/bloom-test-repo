// bloom-deps:

function sanitizeFilename(input: unknown, maxLength?: number): string {
  // Validate maxLength if provided
  if (maxLength !== undefined) {
    if (!Number.isInteger(maxLength) || !isFinite(maxLength) || maxLength < 1) {
      throw new RangeError('maxLength must be a positive integer');
    }
  }

  const effectiveMaxLength = maxLength !== undefined ? maxLength : 255;

  // Validate input type
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Step 1: Replace any character that is not alphanumeric, hyphen, underscore, or period with an underscore
  let result = input.replace(/[^a-zA-Z0-9\-_.]/g, '_');

  // Step 2: Collapse consecutive underscores to a single underscore
  result = result.replace(/_+/g, '_');

  // Step 3: Strip leading and trailing underscores and periods
  result = result.replace(/^[_.]+|[_.]+$/g, '');

  // Step 4: Truncate to maxLength characters
  result = result.slice(0, effectiveMaxLength);

  // Check if result is empty after sanitization
  if (result.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  return result;
}

export { sanitizeFilename };