// bloom-deps:

export function validateTimeZoneOffset(offset: unknown): {
  sign: '+' | '-';
  hours: number;
  minutes: number;
  totalMinutes: number;
} {
  // Step 1: Type check
  if (typeof offset !== 'string') {
    throw new TypeError('offset must be a string');
  }

  // Step 2: Empty/whitespace check
  if (!offset.trim()) {
    throw new RangeError('offset must not be empty');
  }

  const trimmed = offset.trim();

  // Step 3: Sign prefix check
  if (trimmed[0] !== '+' && trimmed[0] !== '-') {
    throw new RangeError("offset must start with '+' or '-'");
  }

  // Step 4: Format validation
  const formatRegex = /^[+-]\d{2}:\d{2}$/;
  if (!formatRegex.test(trimmed)) {
    throw new RangeError('offset must be in ±HH:MM format');
  }

  // Step 5: Extract and parse components
  const sign = trimmed[0] as '+' | '-';
  const hoursStr = trimmed.substring(1, 3);
  const minutesStr = trimmed.substring(4, 6);

  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Step 6: Validate hours range
  if (hours < 0 || hours > 14) {
    throw new RangeError('hours must be between 0 and 14');
  }

  // Step 7: Validate minutes values
  if (minutes !== 0 && minutes !== 15 && minutes !== 30 && minutes !== 45) {
    throw new RangeError('minutes must be 0, 15, 30, or 45');
  }

  // Step 8: Validate max hours constraint
  if (hours === 14 && minutes !== 0) {
    throw new RangeError('offset +14:00 is the maximum; minutes must be 00');
  }

  // Calculate total minutes with sign
  const totalMinutes = (hours * 60 + minutes) * (sign === '-' ? -1 : 1);

  return {
    sign,
    hours,
    minutes,
    totalMinutes,
  };
}