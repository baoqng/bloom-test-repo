// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function normalizePhoneNumber(input: unknown, defaultCountryCode: unknown): string {
  // Validate input type and format
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Validate defaultCountryCode type and format
  if (typeof defaultCountryCode !== 'string' || defaultCountryCode.length === 0) {
    throw new TypeError('defaultCountryCode must be a non-empty string');
  }

  // Validate defaultCountryCode format: /^\+[1-9][0-9]{0,2}$/
  // This means: '+' followed by 1-3 digits, no leading zero
  const countryCodeRegex = /^\+[1-9][0-9]{0,2}$/;
  if (!countryCodeRegex.test(defaultCountryCode)) {
    throw new RangeError('defaultCountryCode must match /^\\+[1-9][0-9]{0,2}$/');
  }

  // Strip whitespace, dashes, dots, and parentheses from input
  const stripped = input.replace(/[\s\-.\(\)]/g, '');

  // Combine: if stripped starts with '+', use as-is; otherwise prepend defaultCountryCode
  let normalized: string;
  if (stripped.startsWith('+')) {
    normalized = stripped;
  } else {
    normalized = defaultCountryCode + stripped;
  }

  // Validate result matches E.164 format: /^\+[1-9][0-9]{7,14}$/
  // This means: '+' followed by a digit 1-9, then 7-13 more digits (total 8-14 digits after +)
  const e164Regex = /^\+[1-9][0-9]{7,14}$/;
  if (!e164Regex.test(normalized)) {
    throw new RangeError('normalized phone number must match E.164 format /^\\+[1-9][0-9]{7,14}$/');
  }

  return normalized;
}

export { normalizePhoneNumber, ServiceError };