// bloom-deps:

function generateSlug(input: unknown, options?: { maxLength?: number; separator?: string; lowercase?: boolean }): string {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const maxLength: number = options?.maxLength !== undefined ? options.maxLength : 80;
  const separator: string = options?.separator !== undefined ? options.separator : '-';
  const lowercase: boolean = options?.lowercase !== undefined ? options.lowercase : true;

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

  // Step 3: replace any character that is not alphanumeric or the separator with the separator
  const escapedSep = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const nonAlphanumOrSepRegex = new RegExp(`[^a-zA-Z0-9${escapedSep}]`, 'g');
  result = result.replace(nonAlphanumOrSepRegex, separator);

  // Step 4: collapse consecutive separators into one
  const consecutiveSepRegex = new RegExp(`${escapedSep}+`, 'g');
  result = result.replace(consecutiveSepRegex, separator);

  // Step 5: strip leading and trailing separators
  const leadingTrailingSepRegex = new RegExp(`^${escapedSep}+|${escapedSep}+$`, 'g');
  result = result.replace(leadingTrailingSepRegex, '');

  // Step 6: truncate to maxLength, then strip trailing separator characters
  if (result.length > maxLength) {
    result = result.slice(0, maxLength);
    result = result.replace(new RegExp(`${escapedSep}+$`), '');
  }

  return result;
}

export { generateSlug };