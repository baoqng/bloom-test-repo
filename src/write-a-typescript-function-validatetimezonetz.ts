// bloom-deps:

export function validateTimeZone(tz: unknown): string {
  if (typeof tz !== 'string') {
    throw new TypeError('Time zone identifier must be a non-empty string');
  }
  if (tz === '') {
    throw new TypeError('Time zone identifier must be a non-empty string');
  }
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
  } catch (e) {
    if (e instanceof RangeError) {
      throw new Error(`Invalid IANA time zone: '${tz}'`);
    }
    throw e;
  }
  return tz;
}