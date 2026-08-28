// bloom-deps:

function validateCronField(value: string, min: number, max: number, fieldIndex: number): void {
  const throwInvalid = () => {
    throw new RangeError(`invalid cron field ${fieldIndex}: ${value}`);
  };

  // Wildcard '*'
  if (value === '*') {
    return;
  }

  // Step '*/N'
  if (value.startsWith('*/')) {
    const stepStr = value.slice(2);
    if (!/^\d+$/.test(stepStr)) throwInvalid();
    if (/^0\d+/.test(stepStr)) throwInvalid();
    const step = parseInt(stepStr, 10);
    if (step < 1 || step > max) throwInvalid();
    return;
  }

  // Range 'N-M'
  const dashIndex = value.indexOf('-');
  if (dashIndex !== -1) {
    const nStr = value.slice(0, dashIndex);
    const mStr = value.slice(dashIndex + 1);
    if (!/^\d+$/.test(nStr) || !/^\d+$/.test(mStr)) throwInvalid();
    if (/^0\d/.test(nStr) || /^0\d/.test(mStr)) throwInvalid();
    const n = parseInt(nStr, 10);
    const m = parseInt(mStr, 10);
    if (n < min || n > max) throwInvalid();
    if (m < min || m > max) throwInvalid();
    if (n > m) throwInvalid();
    return;
  }

  // Literal integer
  if (!/^\d+$/.test(value)) throwInvalid();
  if (/^0\d/.test(value)) throwInvalid();
  const num = parseInt(value, 10);
  if (num < min || num > max) throwInvalid();
}

export function validateCronPattern(expr: unknown): string {
  if (typeof expr !== 'string') {
    throw new TypeError('expr must be a string');
  }

  if (expr.trim() === '') {
    throw new RangeError('expr must not be empty');
  }

  const trimmed = expr.trim();
  const fields = trimmed.split(/\s+/);

  if (fields.length !== 5) {
    throw new RangeError('cron expression must have exactly 5 fields');
  }

  // Field definitions: [min, max]
  const fieldRanges: Array<[number, number]> = [
    [0, 59],   // minute
    [0, 23],   // hour
    [1, 31],   // day-of-month
    [1, 12],   // month
    [0, 7],    // day-of-week (0 and 7 are both Sunday)
  ];

  for (let i = 0; i < 5; i++) {
    const [min, max] = fieldRanges[i];
    validateCronField(fields[i], min, max, i + 1);
  }

  return trimmed;
}