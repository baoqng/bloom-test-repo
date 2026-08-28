// bloom-deps:

type CronField = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';

interface CronParsed {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

const fieldRanges: Record<CronField, { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 7 },
};

const fieldNames: CronField[] = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

function validateCronField(field: string, fieldName: CronField): void {
  const range = fieldRanges[fieldName];

  // Wildcard is always valid
  if (field === '*') {
    return;
  }

  // Check for step syntax: */N
  const stepIndex = field.indexOf('/');
  if (stepIndex !== -1) {
    const prefix = field.slice(0, stepIndex);
    const stepPart = field.slice(stepIndex + 1);

    if (prefix !== '*') {
      throw new RangeError(`Invalid cron field: ${fieldName}`);
    }

    const stepNum = parseInt(stepPart, 10);
    if (isNaN(stepNum) || stepNum < 1) {
      throw new RangeError(`Invalid cron field: ${fieldName}`);
    }

    return;
  }

  // Check for range syntax: M-N
  const rangeIndex = field.indexOf('-');
  if (rangeIndex !== -1) {
    const start = field.slice(0, rangeIndex);
    const end = field.slice(rangeIndex + 1);

    const startNum = parseInt(start, 10);
    const endNum = parseInt(end, 10);

    if (isNaN(startNum) || isNaN(endNum)) {
      throw new RangeError(`Invalid cron field: ${fieldName}`);
    }

    if (startNum < range.min || startNum > range.max) {
      throw new RangeError(`Invalid cron field: ${fieldName}`);
    }

    if (endNum < range.min || endNum > range.max) {
      throw new RangeError(`Invalid cron field: ${fieldName}`);
    }

    if (startNum > endNum) {
      throw new RangeError(`Invalid cron field: ${fieldName}`);
    }

    return;
  }

  // Single numeric value
  const numValue = parseInt(field, 10);
  if (isNaN(numValue)) {
    throw new RangeError(`Invalid cron field: ${fieldName}`);
  }

  if (numValue < range.min || numValue > range.max) {
    throw new RangeError(`Invalid cron field: ${fieldName}`);
  }
}

export function validateCronExpression(
  input: unknown
): CronParsed {
  // Validate input is a non-empty string
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Split by whitespace
  const fields = input.trim().split(/\s+/);

  // Must have exactly 5 fields
  if (fields.length !== 5) {
    throw new SyntaxError('Cron expression must have exactly 5 fields');
  }

  // Validate each field
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i];
    const fieldValue = fields[i];
    validateCronField(fieldValue, fieldName);
  }

  // Return parsed object
  const result: CronParsed = {
    minute: fields[0],
    hour: fields[1],
    dayOfMonth: fields[2],
    month: fields[3],
    dayOfWeek: fields[4],
  };

  return result;
}