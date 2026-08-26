// bloom-deps:

export function validateTimeZoneOffset(offset: unknown): { sign: '+' | '-'; hours: number; minutes: number; totalMinutes: number } {
  if (typeof offset !== 'string') {
    throw new TypeError('offset must be a string');
  }

  if (!offset.trim()) {
    throw new RangeError('offset must not be empty');
  }

  const trimmed = offset.trim();

  if (trimmed[0] !== '+' && trimmed[0] !== '-') {
    throw new RangeError("offset must start with '+' or '-'");
  }

  if (!/^[+-]\d{2}:\d{2}$/.test(trimmed)) {
    throw new RangeError('offset must be in ±HH:MM format');
  }

  const hours = parseInt(trimmed.slice(1, 3), 10);
  const minutes = parseInt(trimmed.slice(4, 6), 10);

  if (hours < 0 || hours > 14) {
    throw new RangeError('hours must be between 0 and 14');
  }

  if (![0, 15, 30, 45].includes(minutes)) {
    throw new RangeError('minutes must be 0, 15, 30, or 45');
  }

  if (hours === 14 && minutes !== 0) {
    throw new RangeError('offset +14:00 is the maximum; minutes must be 00');
  }

  const sign = trimmed[0] as '+' | '-';
  const totalMinutes = (hours * 60 + minutes) * (sign === '-' ? -1 : 1);

  return { sign, hours, minutes, totalMinutes };
}