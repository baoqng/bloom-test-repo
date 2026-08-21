// bloom-deps:

function generateSlug(input: unknown, options?: { maxLength?: number, separator?: string, lowercase?: boolean }): string {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const maxLength = options?.maxLength !== undefined ? options.maxLength : 80;
  const separator = options?.separator !== undefined ? options.separator : '-';
  const lowercase = options?.lowercase !== undefined ? options.lowercase : true;

  if (options?.maxLength !== undefined) {
    if (!Number.isInteger(maxLength) || maxLength < 1) {
      throw new RangeError('maxLength must be a positive integer');
    }
  }

  if (options?.separator !== undefined) {
    if (separator.length !== 1 || /[a-zA-Z0-9]/.test(separator)) {
      throw new RangeError('separator must be a single non-alphanumeric character');
    }
  }

  let result = input;

  // Step 1: lowercase
  if (lowercase) {
    result = result.toLowerCase();
  }

  // Step 2: normalize to NFD and strip combining marks
  result = result.normalize('NFD').replace(/\p{Mn}/gu, '');

  // Step 3: replace any character that is not alphanumeric or separator with separator
  const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const nonAlphanumericOrSeparator = new RegExp(`[^a-zA-Z0-9${escapedSeparator}]`, 'g');
  result = result.replace(nonAlphanumericOrSeparator, separator);

  // Step 4: collapse consecutive separators into one
  const consecutiveSeparators = new RegExp(`${escapedSeparator}+`, 'g');
  result = result.replace(consecutiveSeparators, separator);

  // Step 5: strip leading and trailing separators
  const leadingTrailingSeparators = new RegExp(`^${escapedSeparator}+|${escapedSeparator}+$`, 'g');
  result = result.replace(leadingTrailingSeparators, '');

  // Step 6: truncate to maxLength, then strip trailing separator characters
  if (result.length > maxLength) {
    result = result.slice(0, maxLength);
    result = result.replace(new RegExp(`${escapedSeparator}+$`, 'g'), '');
  }

  return result;
}

export { generateSlug };