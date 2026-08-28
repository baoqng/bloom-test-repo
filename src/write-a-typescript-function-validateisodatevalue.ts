// bloom-deps:

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function daysInMonth(month: number, year: number): number {
  const days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  return days[month];
}

export function validateISODate(value: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new RangeError('string does not match pattern YYYY-MM-DD');
  }

  const yearStr = value.slice(0, 4);
  const monthStr = value.slice(5, 7);
  const dayStr = value.slice(8, 10);

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12) {
    throw new RangeError('month must be between 1 and 12');
  }

  const maxDay = daysInMonth(month, year);
  if (day < 1 || day > maxDay) {
    throw new RangeError('day is not valid for the given month and year');
  }

  return value;
}