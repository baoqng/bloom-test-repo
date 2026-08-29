// bloom-deps:

function parseDateRange(input: unknown): { start: Date; end: Date; durationMs: number } {
  // Validate input is a non-empty string
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Count separator occurrences using indexOf and slice
  const firstSlashIndex = input.indexOf('/');
  if (firstSlashIndex === -1) {
    throw new SyntaxError('Range must contain exactly one slash');
  }

  const secondSlashIndex = input.indexOf('/', firstSlashIndex + 1);
  if (secondSlashIndex !== -1) {
    throw new SyntaxError('Range must contain exactly one slash');
  }

  // Split on first separator only using indexOf+slice
  const startPart = input.slice(0, firstSlashIndex);
  const endPart = input.slice(firstSlashIndex + 1);

  // Parse start date
  let startDate: Date;
  try {
    startDate = new Date(startPart);
    if (isNaN(startDate.getTime())) {
      throw new Error('Invalid date');
    }
  } catch {
    throw new SyntaxError('Invalid start date');
  }

  // Parse end date or duration
  let endDate: Date;
  try {
    if (endPart.startsWith('P')) {
      // Parse ISO 8601 duration
      endDate = parseDuration(startDate, endPart);
    } else {
      // Parse as ISO 8601 date-time
      endDate = new Date(endPart);
      if (isNaN(endDate.getTime())) {
        throw new Error('Invalid date');
      }
    }
  } catch {
    throw new SyntaxError('Invalid end date or duration');
  }

  // Validate end is after start
  if (endDate.getTime() <= startDate.getTime()) {
    throw new RangeError('End must be after start');
  }

  const durationMs = endDate.getTime() - startDate.getTime();

  return { start: startDate, end: endDate, durationMs };
}

function parseDuration(startDate: Date, durationString: string): Date {
  // ISO 8601 duration format: P[n]Y[n]M[n]DT[n]H[n]M[n]S
  const durationRegex =
    /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
  const match = durationString.match(durationRegex);

  if (!match) {
    throw new Error('Invalid duration format');
  }

  const years = parseInt(match[1] || '0', 10);
  const months = parseInt(match[2] || '0', 10);
  const days = parseInt(match[3] || '0', 10);
  const hours = parseInt(match[4] || '0', 10);
  const minutes = parseInt(match[5] || '0', 10);
  const seconds = parseFloat(match[6] || '0');

  // Create a new date by adding components
  const resultDate = new Date(startDate);

  // Add years and months
  resultDate.setFullYear(resultDate.getFullYear() + years);
  resultDate.setMonth(resultDate.getMonth() + months);

  // Add days, hours, minutes, seconds in milliseconds
  const totalMs = days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
  resultDate.setTime(resultDate.getTime() + totalMs);

  return resultDate;
}

export { parseDateRange };